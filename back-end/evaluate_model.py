from app.models.prediction_model import PredictionModel
import os

def evaluate_model():
    # Initialize model
    model = PredictionModel()
    
    # Paths
    data_path = os.path.join('data', 'dataset.csv')
    model_path = os.path.join('data', 'trained_model.pkl')
    
    # Load data and train or load model
    model.load_data(data_path)
    if not os.path.exists(model_path):
        print("Training model...")
        model.train_model(model_path)
    else:
        print("Loading pre-trained model...")
        model.load_model(model_path)
    
    # Evaluate model
    results = model.evaluate_model()
    print("Evaluation Results:")
    print(f"Average NDCG@5: {results['NDCG@5']:.4f}")
    print(f"Number of groups evaluated: {results['num_groups_evaluated']}")

if __name__ == "__main__":
    evaluate_model()