import os
import httplib2 #type: ignore
import SimpleITK as sitk #type: ignore
import pydicom
from pydicom.dataset import Dataset, FileMetaDataset
from pydicom.uid import generate_uid, ExplicitVRLittleEndian

def upload_dicom_to_orthanc(dicom_file):
    orthanc_url = "http://orthanc:8042/instances"
    with open(dicom_file, 'rb') as f:
        dicom_content = f.read()
    
    h = httplib2.Http()
    headers = {'content-type': 'application/dicom'}
    resp, content = h.request(orthanc_url, 'POST', body=dicom_content, headers=headers)
    return resp.status, content

def convert_nifti_to_dicom(nifti_file, output_dir):
    # Load the NIfTI file
    image = sitk.ReadImage(nifti_file)
    image_array = sitk.GetArrayFromImage(image)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate UIDs for the study and series
    study_instance_uid = generate_uid()
    series_instance_uid = generate_uid()
    
    # Iterate through the slices and save as DICOM
    for i in range(image_array.shape[0]):
        slice_array = image_array[i, :, :]
        
        # Create a new DICOM dataset
        ds = Dataset()
        
        # Set file meta information
        file_meta = FileMetaDataset()
        file_meta.MediaStorageSOPClassUID = pydicom.uid.SecondaryCaptureImageStorage
        file_meta.MediaStorageSOPInstanceUID = generate_uid()
        file_meta.ImplementationClassUID = generate_uid()
        file_meta.TransferSyntaxUID = ExplicitVRLittleEndian  # Set the Transfer Syntax UID
        ds.file_meta = file_meta
        
        # Set dataset attributes
        ds.SOPClassUID = file_meta.MediaStorageSOPClassUID
        ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
        ds.PatientName = "Anonymous"
        ds.PatientID = "123456"
        ds.Modality = "MR"
        ds.StudyInstanceUID = study_instance_uid
        ds.SeriesInstanceUID = series_instance_uid
        ds.FrameOfReferenceUID = generate_uid()
        ds.Rows, ds.Columns = slice_array.shape
        ds.SamplesPerPixel = 1
        ds.PhotometricInterpretation = "MONOCHROME2"
        ds.BitsAllocated = 16
        ds.BitsStored = 16
        ds.HighBit = 15
        ds.PixelRepresentation = 1
        ds.InstanceNumber = i + 1  # Set the instance number
        ds.PixelData = slice_array.tobytes()
        
        # Additional metadata
        ds.ImagePositionPatient = [0, 0, float(i)]  # Example position
        ds.ImageOrientationPatient = [1, 0, 0, 0, 1, 0]  # Example orientation
        ds.SliceThickness = 1.0  # Example slice thickness
        ds.SpacingBetweenSlices = 1.0  # Example spacing between slices
        
        # Save the DICOM file
        dicom_filename = os.path.join(output_dir, f"slice_{i:04d}.dcm")
        pydicom.dcmwrite(dicom_filename, ds)