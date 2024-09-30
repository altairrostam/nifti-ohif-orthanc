# NIFTI to OHIF Viewer + Orthanc with Study-level comparison

This project provides a solution for converting NIFTI files to DICOM format, storing them in Orthanc, and enabling simultaneous comparison of multiple studies using the OHIF Viewer.

## Components

- **API**: A FastAPI-based service for handling NIFTI to DICOM conversion and Orthanc interactions.
- **Orthanc**: An open-source DICOM server for storing and managing medical images.
- **OHIF Viewer**: A zero-footprint DICOM viewer for web browsers.
- **Nginx**: A reverse proxy to manage connections between services.

## Prerequisites

- Python 3.11+
- Node.js and Yarn
- Docker (for Orthanc and Nginx)

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/altairrostam/nifti-ohif-orthanc.git
   cd nifti-ohif-orthanc
   ```

2. Set up the API:

   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Run Orthanc:

   ```bash
   docker run -d --name orthanc \
   --network orthanc-network \
   -p 4242:4242 \
   -p 8042:8042 \
   -v ./api/orthanc.json:/etc/orthanc/orthanc.json:ro \
   jodogne/orthanc-plugins
   ```

4. Run Nginx reverse proxy:

   ```bash
   docker run -d --name nginx-proxy \
   --network orthanc-network \
   -p 8080:80 \
   -v ./api/nginx.conf:/etc/nginx/conf.d/default.conf nginx
   ```

5. Start the API:

   ```bash
   cd api
   fastapi dev main.py
   ```

6. Set up and start the OHIF Viewer:

   ```bash
   cd viewer
   yarn install
   yarn run dev
   ```

7. Access the services:
   - Orthanc: `http://localhost:8080/orthanc`
   - API Documentation: `http://localhost:8000/docs`
   - OHIF Viewer: `http://localhost:3000`

## Usage

1. Use the OHIF Viewer to view and upload the stored images.
   - The converted DICOM files are automatically stored in Orthanc.


https://github.com/user-attachments/assets/f91ed644-7db7-49e6-8137-1178dab9772d


2. After the images are uploaded, you can select the studies to compare.


https://github.com/user-attachments/assets/78979265-39a1-4721-8bbf-465504008a52



## Configuration

- Nginx configuration is located in `api/nginx.conf`.

## Development

To make changes to the services:

1. Modify the relevant files in the service directories.
2. For Docker services (Orthanc and Nginx), rebuild and restart the containers.
3. For local services (API and Viewer), restart the respective service.

## Troubleshooting

If you encounter any issues:

1. For Docker services, check the logs:

   ```bash
   docker logs orthanc
   docker logs nginx-proxy
   ```

2. For local services, check the console output.

3. Ensure all services are running and the required ports (8080, 8000, 3000) are not in use by other applications.

4. Verify that the Orthanc and Nginx containers are on the same Docker network:

   ```bash
   docker network inspect orthanc-network
   ```
