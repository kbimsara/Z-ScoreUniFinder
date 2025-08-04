import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import lightgbm as lgb
from sklearn.model_selection import train_test_split
import pickle
import os

class PredictionModel:
    def __init__(self):
        self.df = None
        self.label_encoders = {}
        self.course_avg_zscore = None
        self.district_course_count = None
        self.stream_course_count = None
        self.course_popularity = None
        self.model = None

    def load_data(self, data_path):
        self.df = pd.read_csv(data_path)
        self._preprocess_data()

    def _preprocess_data(self):
        # Rename column
        self.df = self.df.rename(columns={'Exam Year': 'Exam_Year'})

        # Handle NaN values in categorical columns
        categorical_cols = ['Exam_Year', 'District', 'Stream', 'Course', 'University']
        for col in categorical_cols:
            self.df[col] = self.df[col].fillna('Missing').astype(str)

        # Clean Zscore column
        self.df['Zscore_Values'] = pd.to_numeric(self.df['Zscore'], errors='coerce').fillna(-10)

        # Discretize Zscore_Values
        bins = [-float('inf'), self.df['Zscore_Values'].quantile(0.25), 
                self.df['Zscore_Values'].quantile(0.50),
                self.df['Zscore_Values'].quantile(0.75), 
                self.df['Zscore_Values'].quantile(0.90), float('inf')]
        labels = [0, 1, 2, 3, 4]
        self.df['Zscore_Relevance'] = pd.cut(self.df['Zscore_Values'], bins=bins, 
                                          labels=labels, include_lowest=True).astype(int)

        # Calculate features
        self.df['zscore_percentile'] = self.df['Zscore_Values'].rank(pct=True)
        
        self.course_avg_zscore = self.df[self.df['Zscore_Values'] != -10].groupby(
            'Matched_Course_University')['Zscore_Values'].mean()
        
        self.df['zscore_vs_course_avg'] = self.df['Zscore_Values'] - self.df['Matched_Course_University'].map(
            self.course_avg_zscore).fillna(0)
        
        self.district_course_count = self.df.groupby(['District', 'Matched_Course_University']).size()
        self.df['district_competition'] = self.df.apply(
            lambda x: self.district_course_count.get((x['District'], x['Matched_Course_University']), 0), axis=1)
        
        self.stream_course_count = self.df.groupby(['Stream', 'Matched_Course_University']).size()
        self.df['stream_course_compatibility'] = self.df.apply(
            lambda x: self.stream_course_count.get((x['Stream'], x['Matched_Course_University']), 0), axis=1)
        
        self.course_popularity = self.df['Matched_Course_University'].value_counts()
        self.df['course_popularity'] = self.df['Matched_Course_University'].map(self.course_popularity)
        
        self.df['Intake'] = self.df['Intake'].fillna(0)
        self.df['intake_normalized'] = self.df['Intake'] / self.df['Intake'].max()
        
        self.df['is_NQC'] = self.df['Zscore_Values'] == -10

        # Encode categorical features
        categorical_cols = ['Exam_Year', 'District', 'Stream', 'Course', 'University', 'is_NQC']
        for col in categorical_cols:
            le = LabelEncoder()
            self.df[col + '_encoded'] = le.fit_transform(self.df[col])
            self.label_encoders[col] = le

        # Create group ID
        self.df['group_id'] = self.df['District'] + '_' + self.df['Stream'] + '_' + self.df['Exam_Year'].astype(str)
        
        # Filter groups
        group_sizes = self.df.groupby('group_id').size()
        valid_groups = group_sizes[group_sizes >= 2].index
        self.df = self.df[self.df['group_id'].isin(valid_groups)]

    def train_model(self, model_path):
        features = [
            'Exam_Year_encoded', 'District_encoded', 'Stream_encoded', 'Course_encoded', 
            'University_encoded', 'Zscore_Values', 'zscore_percentile', 
            'zscore_vs_course_avg', 'district_competition', 'stream_course_compatibility', 
            'course_popularity', 'intake_normalized', 'is_NQC_encoded'
        ]
        target = 'Zscore_Relevance'

        train_data, test_data = train_test_split(self.df, test_size=0.2, random_state=42)
        train_group_counts = train_data.groupby('group_id').size().values
        test_group_counts = test_data.groupby('group_id').size().values

        train_dataset = lgb.Dataset(
            data=train_data[features],
            label=train_data[target],
            group=train_group_counts,
            categorical_feature=[0, 1, 2, 3, 4, 12]
        )

        params = {
            'objective': 'lambdarank',
            'metric': ['ndcg'],
            'max_depth': 6,
            'num_leaves': 31,
            'learning_rate': 0.1,
            'n_estimators': 1000,
            'random_state': 42,
            'verbose': 100,
            'min_data_in_leaf': 5,
            'min_gain_to_split': 0.0
        }

        self.model = lgb.LGBMRanker(**params)
        self.model.fit(
            X=train_data[features],
            y=train_data[target],
            group=train_group_counts,
            eval_set=[(test_data[features], test_data[target])],
            eval_group=[test_group_counts],
            eval_metric=['ndcg'],
            eval_at=[5],
            callbacks=[lgb.early_stopping(stopping_rounds=50, verbose=True)]
        )

        self.model.booster_.save_model(model_path)
        
    def load_model(self, model_path):
        self.model = lgb.Booster(model_file=model_path)