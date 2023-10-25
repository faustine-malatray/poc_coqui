"use client";

import { useState } from 'react';
import "./globals.css";

export default function Home() {
  const [countrySelected, setCountrySelected] = useState('');

  const mappingCountryLanguage = (country: string) => {
    switch (country) {
      case "France": {
        return "fr";
      }
      case "UK": {
        return "en";
      }
      case "Spain": {
        return "es";
      }
      default:
        return "en";
    }
  };

  const mappingCountryNationality = (country: string) => {
    switch (country) {
      case "France": {
        return "French";
      }
      case "UK": {
        return "English";
      }
      case "Spain": {
        return "Spanish";
      }
      default:
        return "English";
    }
  };

  const countryChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountrySelected(event.target.value);
  };

  const handleCoquiDownload = async () => {
    const coquiApiRouteXttsVersion = "https://app.coqui.ai/api/v2/samples/xtts/render/";
    const API_KEY = "Bearer xxxxxx"
    try {
      const coquiAPIResponse = await fetch(coquiApiRouteXttsVersion, {
        method: "POST", headers: {
          "Content-Type": "application/json", "Authorization": `"${API_KEY}"`,
          "Accept": "application/json"
        },
        body: `{"voice_id": "c791b5b5-0558-42b8-bb0b-602ac5efc0b9","text": "Hi there fellow citizen of ${countrySelected}!","language": "${mappingCountryLanguage(countrySelected)}"}`
      })
      if (coquiAPIResponse.ok) {
        const apiResponseJson = await coquiAPIResponse.json();
        try {
          const audioResponse = await fetch(apiResponseJson.audio_url);
          if (!audioResponse.ok) {
            throw new Error("Failed to fetch audio data");
          }
          const contentRangeHeader = audioResponse.headers.get("Content-Range");
          const contentLength = audioResponse.headers.get("Content-Length");
          const audioData = await audioResponse.arrayBuffer();
          const audioBlob = new Blob([audioData], { type: 'audio/wav' });
          const audioBlobUrl = URL.createObjectURL(audioBlob);
          const audioElement = document.getElementById("audioPlayer") as HTMLAudioElement;
          audioElement.src = audioBlobUrl;
          audioElement.setAttribute('data-content-range', contentRangeHeader);
          audioElement.setAttribute('data-content-length', contentLength);
          audioElement.play();
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
    catch (error) {
      console.error('Error:', error);
    }

  }

  return (
    <main>
      <div className="HomePage">
        <span>Hi, can you tell me where are you from ?</span>
        <br />
        <select id="CountrySelector" defaultValue="UK" onChange={countryChanged}>
          <option value="France">France</option>
          <option value="UK">United Kingdom</option>
          <option value="Spain">Espana</option>
        </select>
        <br />
        <button onClick={handleCoquiDownload}>Click for {mappingCountryNationality(countrySelected)} greetings !</button>
        <audio id="audioPlayer" controls></audio>
      </div>
    </main>
  )
};