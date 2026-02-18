# 🌊 Uncertainty-Aware Flood Susceptibility Mapping using Google Earth Engine

## 📌 Project Overview
Floods are among the most destructive natural disasters, especially in coastal regions.
This project presents an **uncertainty-aware machine learning framework** for **flood susceptibility mapping**
of **coastal Karnataka (India)** using **Google Earth Engine (GEE)**.

Unlike traditional flood mapping approaches, this work not only predicts **flood-prone zones**
but also quantifies the **model’s uncertainty**, helping decision-makers understand
*how reliable* each prediction is.

---

## 🎯 Objectives
- To generate a **high-resolution flood susceptibility probability map**
- To quantify **model uncertainty** using probabilistic outputs
- To deploy an **interactive web-based GEE application** for real-time inspection
- To support **disaster preparedness and urban planning**

---

## 🗺️ Study Area
- Dakshina Kannada  
- Udupi  
- Uttara Kannada  

(Coastal districts of Karnataka, India)

---

## 🧠 Methodology
1. **Data Acquisition**
   - Sentinel-1 SAR (Flood inventory generation)
   - SRTM DEM (Topographic features)
   - ERA5 Rainfall
   - SMAP Soil Moisture

2. **Feature Engineering**
   - Elevation, Slope
   - Topographic Wetness Index (TWI)
   - Stream Power Index (SPI)
   - Rainfall & Soil Moisture indices

3. **Machine Learning Model**
   - Random Forest classifier (probability mode)
   - Trained using flood/non-flood samples derived from SAR imagery

4. **Uncertainty Estimation**
   - Entropy-based uncertainty calculation
   - Identification of low-confidence prediction zones

5. **Deployment**
   - Interactive Google Earth Engine Web Application
   - Click-based inspection of flood probability and uncertainty

---

## 📊 Results
- Overall Accuracy: **~92%**
- Kappa Coefficient: **~0.84**
- Outputs:
  - Flood Susceptibility Map
  - Model Uncertainty Map
  - Interactive GEE Web App

---

## 🛠️ Technologies Used
- Google Earth Engine (JavaScript API)
- Machine Learning (Random Forest)
- Remote Sensing & GIS
- Sentinel-1 SAR
- SRTM DEM
- ERA5 & SMAP datasets

---

## 🚀 How to Run (Google Earth Engine)
1. Login to Google Earth Engine Code Editor  
2. Copy the scripts from this repository  
3. Paste into GEE JavaScript Editor  
4. Run and visualize results  
5. Deploy as Web App (optional)

---

## 👩‍💻 Authors
- **Swasthi S Nayak**
- **Thanvi D Acharya**
- **Swarna**


---

## 🏫 Academic Context
Mini Project  
Department of Computer Science & Engineering  
Visvesvaraya Technological University (VTU)

---

## 📜 License
This project is intended for academic and research purposes.
