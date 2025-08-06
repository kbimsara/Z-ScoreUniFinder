# Dataset Setup Instructions

Ensure the dataset (`data/dataset.csv`) is in the `back-end/data/` directory (see [Dataset Requirements](#dataset-requirements)). You can download the dataset from Kaggle and Hugging Face platforms.

## Option 1: Direct Download from Kaggle Hub

Download the dataset:

```bash
# Install dependencies as needed:
# pip install kagglehub[pandas-datasets]
import kagglehub
from kagglehub import KaggleDatasetAdapter
  
# Set the path to the file you'd like to load
file_path = ""
  
# Load the latest version
df = kagglehub.load_dataset(
   KaggleDatasetAdapter.PANDAS,
   "ranaweerakasi/sri-lanakan-ugc-cutoff-marks-dataset-2020-2025",
   file_path,
   # Provide any additional arguments like 
   # sql_query or pandas_kwargs. See the 
   # documenation for more information:
   # https://github.com/Kaggle/kagglehub/blob/main/README.md#kaggledatasetadapterpandas
)

print("First 5 records:", df.head())
```

## Option 2: Download from Hugging Face

Install the `datasets` library:

```bash
pip install datasets
```

Load the dataset:

```python
from datasets import load_dataset
dataset = load_dataset("kasi-ranaweera/Sri_Lankan_UGC_Cutoff_Mark_Dataset")
dataset["train"].to_pandas().to_csv("back-end/data/dataset.csv", index=False)  # If split
```

For private datasets, use a token:

```python
dataset = load_dataset("kasi-ranaweera/Sri_Lankan_UGC_Cutoff_Mark_Dataset", token="your-hf-token")
```

## Option 3: Download from Kaggle

Download the dataset:

```bash
kaggle datasets download -d ranaweerakasi/sri-lanakan-ugc-cutoff-marks-dataset-2020-2025 -p back-end/data
unzip back-end/data/sri-lankan-university-z-score-recommendations.zip -d back-end/data
```

Install the Kaggle CLI if needed:

```bash
pip install kaggle
```

Set up Kaggle API credentials:
- Go to [kaggle.com/settings](https://www.kaggle.com/settings), click **Create New Token**, and place `kaggle.json` in `~/.kaggle/`.
