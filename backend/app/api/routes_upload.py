from io import BytesIO

import pandas as pd
from fastapi import APIRouter, File, UploadFile

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()

    if file.filename.endswith(".csv"):
        df = pd.read_csv(BytesIO(contents))
    elif file.filename.endswith(".xlsx"):
        df = pd.read_excel(BytesIO(contents))
    else:
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "message": "Archivo subido, pero preview no disponible para este formato."
        }

    preview_rows = df.head(5).fillna("").to_dict(orient="records")

    insights = {
        "rows": int(df.shape[0]),
        "columns_count": int(df.shape[1]),
    }

    findings = []

    if "ventas" in df.columns:
        total_sales = float(df["ventas"].sum())
        avg_sales = float(df["ventas"].mean())
        max_sales = float(df["ventas"].max())

        insights["total_sales"] = total_sales
        insights["avg_sales"] = avg_sales

        findings.append(f"Las ventas totales son {total_sales:.0f}.")
        findings.append(f"El promedio de ventas por registro es {avg_sales:.2f}.")
        findings.append(f"La venta máxima registrada es {max_sales:.0f}.")

    if "canal" in df.columns:
        top_channel = str(df["canal"].mode().iloc[0])
        insights["top_channel"] = top_channel
        findings.append(f"El canal más frecuente es {top_channel}.")

        if "ventas" in df.columns:
            sales_by_channel = (
                df.groupby("canal", as_index=False)["ventas"]
                .sum()
                .sort_values("ventas", ascending=False)
            )
            top_sales_channel = str(sales_by_channel.iloc[0]["canal"])
            findings.append(
                f"El canal con mayores ventas acumuladas es {top_sales_channel}."
            )
        else:
            sales_by_channel = pd.DataFrame()

    else:
        sales_by_channel = pd.DataFrame()

    if "fecha" in df.columns and "ventas" in df.columns:
        top_day = df.loc[df["ventas"].idxmax(), "fecha"]
        findings.append(f"La fecha con mayor venta es {top_day}.")

    chart_channel = []
    if not sales_by_channel.empty:
        chart_channel = sales_by_channel.fillna("").to_dict(orient="records")

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "columns": df.columns.tolist(),
        "preview": preview_rows,
        "insights": insights,
        "findings": findings,
        "chart_channel": chart_channel,
    }
