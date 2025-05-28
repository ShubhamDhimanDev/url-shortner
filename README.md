# 🔗 URL Shortener — React + Laravel + Sanctum

A full-stack URL shortener built with **React**, **Laravel**, and **Sanctum**. This application allows users to create and manage short URLs with built-in **analytics tracking** and **QR code generation**.

🌐 **Live Demo**: [urlshortener.insanedev.in](https://urlshortener.insanedev.in/)

## ✨ Features

- 🔐 Authentication using Laravel Sanctum
- ✂️ Shorten long URLs with ease
- 📊 URL analytics with IP tracking and visit timestamps
- 📎 Generate downloadable QR codes for each short link
- 📋 Copy short URL with one click
- 🔒 Private dashboard for managing your URLs
- 📱 Fully responsive design

## 🛠 Tech Stack

### Backend (Laravel)
- Laravel 11
- Sanctum for authentication
- MySQL for database
- Laravel QRCode (Simple QrCode)
- CORS, Validation, Routing, API Resources

### Frontend (React)
- React 18+
- Axios for API calls
- React Router
- TailwindCSS for styling
- React Icons

## 🚀 Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL
- Laravel CLI

---

### Backend Setup

```bash
git clone https://github.com/ShubhamDhimanDev/url-shortner.git
cd url-shortner/backend

cp .env.example .env
composer install
php artisan key:generate

# Set up your DB credentials in `.env`
php artisan migrate
php artisan serve
