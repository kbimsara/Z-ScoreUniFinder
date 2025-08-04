import pandas as pd
import numpy as np
import pickle
import os
import time
import logging
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from lightgbm import LGBMClassifier
from typing import List
from app.models.schemas import StudentProfile, CourseRecommendation

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.model = None
        self.encoders = {}
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.is_trained = False
        self.df_original = None
        self.model_stats = {}

    def load_data(self, filepath: str = "data/dataset.csv"):
        try:
            df = pd.read_csv(filepath)
            # Handle NQC values in Zscore
            df['Zscore'] = pd.to_numeric(df['Zscore'], errors='coerce').fillna(0)
            # Validate streams
            valid_streams = [
                "Arts", "Commerce", "Biological Science", "Physical Science",
                "Engineering Technology", "Biosystems Technology", "Cross Stream"
            ]
            df = df[df['Stream'].isin(valid_streams)]
            self.df_original = df
            logger.info(f"Dataset loaded successfully: {self.df_original.shape}")
            return True
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            return False

    def preprocess_data(self, df):
        df = df.drop_duplicates().dropna(subset=['District', 'Stream', 'Course', 'University'])
        
        # Create combined course-university identifier
        df['Course_University'] = df['Course'] + ' (' + df['University'] + ')'
        
        # Feature engineering
        df['zscore_percentile'] = df['Zscore'].rank(pct=True)
        course_avg_zscore = df.groupby('Course_University')['Zscore'].mean()
        df['zscore_vs_course_avg'] = df['Zscore'] - df['Course_University'].map(course_avg_zscore)
        
        district_course_count = df.groupby(['District', 'Course_University']).size()
        df['district_competition'] = df.apply(
            lambda x: district_course_count.get((x['District'], x['Course_University']), 0), axis=1
        )
        
        stream_course_count = df.groupby(['Stream', 'Course_University']).size()
        df['stream_course_compatibility'] = df.apply(
            lambda x: stream_course_count.get((x['Stream'], x['Course_University']), 0), axis=1
        )
        
        df['years_since_base'] = df['Exam Year'] - df['Exam Year'].min()
        course_popularity = df['Course_University'].value_counts()
        df['course_popularity'] = df['Course_University'].map(course_popularity)
        
        intake_avg = df.groupby('Course_University')['Intake'].mean()
        df['intake_size'] = df['Course_University'].map(intake_avg)
        
        # Create target variable
        course_min_zscore = df.groupby('Course_University')['Zscore'].quantile(0.3)
        df['course_min_zscore'] = df['Course_University'].map(course_min_zscore)
        df['admission_probability'] = np.where(df['Zscore'] >= df['course_min_zscore'], 1, 0)
        
        # Encode categorical variables
        self.encoders['district'] = LabelEncoder().fit(df['District'])
        self.encoders['course'] = LabelEncoder().fit(df['Course_University'])
        self.encoders['stream'] = LabelEncoder().fit(df['Stream'])
        
        df['District_encoded'] = self.encoders['district'].transform(df['District'])
        df['Course_encoded'] = self.encoders['course'].transform(df['Course_University'])
        df['Stream_encoded'] = self.encoders['stream'].transform(df['Stream'])
        
        return df

    def train_model(self):
        if self.df_original is None:
            if not self.load_data():
                raise Exception("Failed to load dataset")
        
        df_processed = self.preprocess_data(self.df_original)
        
        self.feature_columns = [
            'Zscore', 'zscore_percentile', 'zscore_vs_course_avg',
            'District_encoded', 'Stream_encoded', 'years_since_base',
            'district_competition', 'stream_course_compatibility', 
            'course_popularity', 'intake_size'
        ]
        
        X = df_processed[self.feature_columns]
        y = df_processed['admission_probability']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        numerical_features = ['Zscore', 'zscore_percentile', 'zscore_vs_course_avg', 'years_since_base', 'intake_size']
        numerical_indices = [self.feature_columns.index(col) for col in numerical_features]
        
        X_train_scaled = X_train.copy()
        X_test_scaled = X_test.copy()
        X_train_scaled.iloc[:, numerical_indices] = self.scaler.fit_transform(X_train.iloc[:, numerical_indices])
        X_test_scaled.iloc[:, numerical_indices] = self.scaler.transform(X_test.iloc[:, numerical_indices])
        
        self.model = LGBMClassifier(
            n_estimators=100,
            learning_rate=0.1,
            random_state=42,
            force_col_wise=True
        )
        
        self.model.fit(X_train_scaled, y_train)
        y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
        score = roc_auc_score(y_test, y_pred_proba)
        
        self.model_stats = {
            'model_name': 'LightGBM',
            'accuracy': score,
            'total_courses': len(df_processed['Course_University'].unique()),
            'districts': list(df_processed['District'].unique()),
            'streams': list(df_processed['Stream'].unique()),
            'last_trained': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        logger.info(f"Model trained: LightGBM with AUC: {score:.4f}")
        self.is_trained = True
        self.save_model()
        return self

    def get_recommendations(self, student_profile: StudentProfile, top_k: int = 10) -> List[CourseRecommendation]:
        if not self.is_trained:
            raise Exception("Model must be trained before making recommendations")
        
        start_time = time.time()
        all_courses = self.df_original['Course_University'].unique()
        recommendations = []
        
        for course in all_courses:
            try:
                course_parts = course.split(' (')
                course_name = course_parts[0]
                university_name = course_parts[1][:-1] if len(course_parts) > 1 else "Unknown University"
                
                district_encoded = self.encoders['district'].transform([student_profile.district])[0]
                stream_encoded = self.encoders['stream'].transform([student_profile.stream.value])[0]
                
                zscore_percentile = (student_profile.zscore - self.df_original['Zscore'].min()) / \
                                   (self.df_original['Zscore'].max() - self.df_original['Zscore'].min())
                
                course_avg_zscore = self.df_original[self.df_original['Course_University'] == course]['Zscore'].mean()
                zscore_vs_course_avg = student_profile.zscore - course_avg_zscore
                
                years_since_base = student_profile.exam_year - self.df_original['Exam Year'].min()
                
                district_competition = len(self.df_original[
                    (self.df_original['District'] == student_profile.district) & 
                    (self.df_original['Course_University'] == course)
                ])
                
                stream_course_compatibility = len(self.df_original[
                    (self.df_original['Stream'] == student_profile.stream.value) & 
                    (self.df_original['Course_University'] == course)
                ])
                
                course_popularity = self.df_original['Course_University'].value_counts().get(course, 0)
                intake_size = self.df_original[self.df_original['Course_University'] == course]['Intake'].mean()
                
                features = np.array([[
                    student_profile.zscore,
                    zscore_percentile,
                    zscore_vs_course_avg,
                    district_encoded,
                    stream_encoded,
                    years_since_base,
                    district_competition,
                    stream_course_compatibility,
                    course_popularity,
                    intake_size
                ]])
                
                features_scaled = features.copy()
                numerical_indices = [self.feature_columns.index(col) for col in ['Zscore', 'zscore_percentile', 'zscore_vs_course_avg', 'years_since_base', 'intake_size']]
                features_scaled[:, numerical_indices] = self.scaler.transform(features[:, numerical_indices])
                
                admission_prob = self.model.predict_proba(features_scaled)[0][1]
                
                recommendations.append(CourseRecommendation(
                    course=course_name,
                    university=university_name,
                    admission_probability=round(admission_prob, 4),
                    rank=0,
                    category=self._categorize_course(course_name),
                    intake=int(intake_size) if not pd.isna(intake_size) else 0
                ))
                
            except Exception as e:
                logger.warning(f"Skipping course {course}: {e}")
                continue
        
        recommendations.sort(key=lambda x: x.admission_probability, reverse=True)
        for i, rec in enumerate(recommendations[:top_k]):
            rec.rank = i + 1
        
        logger.info(f"Generated {len(recommendations)} recommendations in {time.time() - start_time:.3f}s")
        return recommendations[:top_k]

    def _categorize_course(self, course_name: str) -> str:
        course_lower = course_name.lower()
        if 'medicine' in course_lower or 'dental' in course_lower:
            return "Medical"
        elif 'engineering' in course_lower:
            return "Engineering"
        elif 'dance' in course_lower or 'arts' in course_lower:
            return "Arts"
        elif 'commerce' in course_lower or 'management' in course_lower:
            return "Commerce"
        else:
            return "General"

    def save_model(self, filepath: str = "data/trained_model.pkl"):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'encoders': self.encoders,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns,
                'is_trained': self.is_trained,
                'model_stats': self.model_stats
            }, f)
        logger.info(f"Model saved to {filepath}")

    def load_model(self, filepath: str = "data/trained_model.pkl"):
        try:
            with open(filepath, 'rb') as f:
                artifacts = pickle.load(f)
            self.model = artifacts['model']
            self.encoders = artifacts['encoders']
            self.scaler = artifacts['scaler']
            self.feature_columns = artifacts['feature_columns']
            self.is_trained = artifacts['is_trained']
            self.model_stats = artifacts.get('model_stats', {})
            self.load_data()
            logger.info(f"Model loaded from {filepath}")
            return True
        except FileNotFoundError:
            logger.warning(f"Model file not found: {filepath}. Training new model...")
            self.train_model()
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def get_model_stats(self):
        return self.model_stats