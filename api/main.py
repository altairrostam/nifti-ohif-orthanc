from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from utils import convert_nifti_to_dicom, upload_dicom_to_orthanc


app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save the uploaded NIfTI file
        nifti_file_location = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)  # Ensure the uploads directory exists
        with open(nifti_file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert NIfTI to DICOM
        output_dir = "uploads/dicom"  # Directory to save DICOM files
        convert_nifti_to_dicom(nifti_file_location, output_dir)
        
        # Upload all DICOM slices to Orthanc
        status_codes = []
        responses = []
        for dicom_file in os.listdir(output_dir):
            dicom_file_location = os.path.join(output_dir, dicom_file)
            status_code, response = upload_dicom_to_orthanc(dicom_file_location)
            status_codes.append(status_code)
            responses.append(response)
        
        result = {"message": f"File '{file.filename}' uploaded and converted successfully.", "status_codes": status_codes, "responses": responses}
    finally:
        # Clean up: remove the uploads folder
        shutil.rmtree("uploads", ignore_errors=True)
    
    return result