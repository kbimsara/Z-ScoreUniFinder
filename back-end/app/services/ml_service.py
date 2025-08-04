from app.models.prediction_model import PredictionModel
from app.models.schemas import StudentInput, RecommendationResponse, CourseRecommendation
import pandas as pd
import os

class MLService:
    def __init__(self, data_path: str, model_path: str):
        self.model = PredictionModel()
        self.data_path = data_path
        self.model_path = model_path
        
        if not os.path.exists(model_path):
            self.model.load_data(data_path)
            self.model.train_model(model_path)
        else:
            self.model.load_data(data_path)
            self.model.load_model(model_path)

    def recommend_courses(self, input_data: StudentInput) -> RecommendationResponse:
        df = self.model.df
        course_university_pairs = df[df['Stream'] == input_data.stream][
            ['Course', 'University']].drop_duplicates().values.tolist()
        
        new_student = pd.DataFrame({
            'Exam_Year': [df['Exam_Year'].max()] * len(course_university_pairs),
            'District': [input_data.district] * len(course_university_pairs),
            'Stream': [input_data.stream] * len(course_university_pairs),
            'Zscore_Values': [input_data.zscore] * len(course_university_pairs),
            'Course': [pair[0] for pair in course_university_pairs],
            'University': [pair[1] for pair in course_university_pairs]
        })
        new_student['Matched_Course_University'] = new_student['Course'] + ' (' + new_student['University'] + ')'

        # Apply preprocessing
        new_student['zscore_percentile'] = new_student['Zscore_Values'].rank(pct=True)
        new_student['zscore_vs_course_avg'] = new_student['Zscore_Values'] - new_student[
            'Matched_Course_University'].map(self.model.course_avg_zscore).fillna(0)
        new_student['district_competition'] = new_student.apply(
            lambda x: self.model.district_course_count.get(
                (x['District'], x['Matched_Course_University']), 0), axis=1)
        new_student['stream_course_compatibility'] = new_student.apply(
            lambda x: self.model.stream_course_count.get(
                (x['Stream'], x['Matched_Course_University']), 0), axis=1)
        new_student['course_popularity'] = new_student['Matched_Course_University'].map(
            self.model.course_popularity).fillna(0)
        new_student['intake_normalized'] = new_student['Matched_Course_University'].map(
            df.groupby('Matched_Course_University')['Intake'].first() / df['Intake'].max()
        ).fillna(0)
        new_student['is_NQC'] = new_student['Zscore_Values'] == -10

        categorical_cols = ['Exam_Year', 'District', 'Stream', 'Course', 'University', 'is_NQC']
        for col in categorical_cols:
            col_encoded = col + '_encoded'
            try:
                new_student[col_encoded] = self.model.label_encoders[col].transform(
                    new_student[col].fillna('Missing').astype(str))
            except ValueError:
                new_student[col_encoded] = new_student[col].map(
                    lambda x: self.model.label_encoders[col].transform([x])[0] 
                    if x in self.model.label_encoders[col].classes_ 
                    else self.model.label_encoders[col].transform(['Missing'])[0]
                )

        new_student['group_id'] = new_student['District'] + '_' + new_student['Stream'] + '_' + new_student['Exam_Year']

        features = [
            'Exam_Year_encoded', 'District_encoded', 'Stream_encoded', 'Course_encoded', 
            'University_encoded', 'Zscore_Values', 'zscore_percentile', 
            'zscore_vs_course_avg', 'district_competition', 'stream_course_compatibility', 
            'course_popularity', 'intake_normalized', 'is_NQC_encoded'
        ]

        predictions = self.model.model.predict(new_student[features])
        new_student['Predicted_Score'] = predictions
        ranked_courses = new_student.sort_values(by='Predicted_Score', ascending=False)

        viable_courses = ranked_courses[
            (ranked_courses['zscore_vs_course_avg'] >= -0.5) & (~ranked_courses['is_NQC'])
        ][['Course', 'University', 'Predicted_Score']]

        recommendations = [
            CourseRecommendation(
                course=row['Course'],
                university=row['University'],
                predicted_score=row['Predicted_Score']
            ) for _, row in viable_courses.iterrows()
        ]

        return RecommendationResponse(recommendations=recommendations)