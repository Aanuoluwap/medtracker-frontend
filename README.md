# Medtracker

A smart medication tracking application with AI-powered insights and simulated WearOS synchronization. Medtracker is designed to help patients manage their medication schedules effectively while providing hospital staff with a dashboard for monitoring (in Hospital Mode).

## Features

*   **Medication Scheduling & Tracking**: Easily add medications with dosage, frequency, and time.
*   **AI-Powered Insights**: Uses Google's Gemini AI to provide safety instructions, food interaction advice, and side effect warnings based on the patient's age and medication details.
*   **Dual Modes**:
    *   **Patient Mode**: Personal dashboard for tracking meds, viewing AI advice, and accessing emergency features.
    *   **Hospital Mode**: Dashboard for healthcare providers to monitor patient status.
*   **WearOS Simulator**: A built-in simulator demonstrating how the app integrates with wearable devices for real-time sync and vitals monitoring.
*   **Emergency SOS**: Configurable emergency contacts and SOS trigger (manual or vitals-based).
*   **Local Storage Persistence**: Data is saved locally in the browser.

## Tech Stack

*   **Frontend**: React, Vite, TypeScript
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **AI**: Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd medtracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

To enable AI features, you need a Google Gemini API key.

1.  Create a `.env.local` file in the root directory:
    ```bash
    touch .env.local
    ```

2.  Add your API key to `.env.local`:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal).

## Usage

*   **Dashboard**: View your daily medication timeline.
*   **Add Medication**: Click the "+" button to add a new prescription. The AI will analyze it automatically.
*   **Watch Simulator**: In Patient Mode, toggle "Show Watch" to see the wearable companion interface.
*   **Settings**: Configure your profile, toggle between Patient/Hospital modes, and set up emergency contacts.

## License

This project is open source.
