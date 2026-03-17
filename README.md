# InsightForge

InsightForge es una aplicación de análisis de datos orientada a negocio que permite subir archivos CSV, Excel o PDF para generar métricas clave, hallazgos automáticos, visualizaciones y una vista previa del dataset.

## Features

- Carga de archivos .csv, .xlsx y .pdf
- Vista previa automática del dataset
- Métricas clave del archivo cargado
- Hallazgos automáticos en lenguaje natural
- Gráfico de ventas por fecha
- Gráfico de ventas por canal
- Interfaz moderna construida con Next.js
- Backend API con FastAPI y pandas

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Recharts

### Backend
- FastAPI
- Python
- pandas
- Uvicorn

## Project Structure

```bash
insightforge/
├── backend/
├── frontend/
├── data_samples/
├── .gitignore
└── README.md