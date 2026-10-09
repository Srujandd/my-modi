import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  MapPin,
  RefreshCw,
  Crosshair,
  Search,
  ChevronDown,
  Check,
  Sun,
  Cloud,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { SupportedLanguage } from '../types/farm';
import { TRANSLATIONS } from '../data/translations';
import { RealtimeWeather, REGION_PRESETS, RegionPreset } from '../services/weatherService';

interface WeatherWidgetProps {
  currentLang: SupportedLanguage;
  highContrast: boolean;
  weather: RealtimeWeather | null;
  isLoading: boolean;
  currentRegion: RegionPreset;
  customLocationLabel?: string | null;
  onSelectRegion: (region: RegionPreset) => void;
  onSearchCity: (cityQuery: string) => void;
  onDetectGps: () => void;
  onRefresh: () => void;
}

const WIDGET_LABELS: Record<
  SupportedLanguage,
  {
    temperature: string;
    feelsLike: string;
    dewPoint: string;
    rainfall: string;
    cloudCover: string;
    windSpeed: string;
    fungalRisk: string;
    riskHigh: string;
    riskModerate: string;
    riskLow: string;
    dryCanopy: string;
    activeRain: string;
    searchPlaceholder: string;
    searchBtn: string;
    updatedAt: string;
    owmVerified: string;
    thermalOptimal: string;
    thermalHot: string;
    thermalCool: string;
  }
> = {
  en: {
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    dewPoint: 'Dew Point',
    rainfall: 'Rainfall (1h)',
    cloudCover: 'Cloud Cover',
    windSpeed: 'Wind & Drift',
    fungalRisk: 'Fungal Spore Risk',
    riskHigh: 'High Blight Risk',
    riskModerate: 'Moderate',
    riskLow: 'Low Risk',
    dryCanopy: 'Dry Canopy · Safe to Spray',
    activeRain: 'Active Rain · Washoff Risk',
    searchPlaceholder: 'Enter village, town, or district...',
    searchBtn: 'Check',
    updatedAt: 'Updated',
    owmVerified: 'OpenWeatherMap Live',
    thermalOptimal: 'Optimal Crop Growth',
    thermalHot: 'High Heat · Irrigate Early',
    thermalCool: 'Cool Canopy'
  },
  hi: {
    temperature: 'तापमान',
    feelsLike: 'महसूस',
    dewPoint: 'ओस बिंदु',
    rainfall: 'वर्षा (1 घंटा)',
    cloudCover: 'बादल',
    windSpeed: 'हवा की गति',
    fungalRisk: 'फफूंद जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskModerate: 'सामान्य',
    riskLow: 'कम जोखिम',
    dryCanopy: 'सूखी पत्तियां · छिड़काव सुरक्षित',
    activeRain: 'बारिश · दवा बहने का खतरा',
    searchPlaceholder: 'गांव या जिले का नाम लिखें...',
    searchBtn: 'खोजें',
    updatedAt: 'अपडेट',
    owmVerified: 'OpenWeatherMap लाइव',
    thermalOptimal: 'फसल वृद्धि हेतु अनुकूल',
    thermalHot: 'तेज गर्मी · सुबह सिंचाई करें',
    thermalCool: 'ठंडा मौसम'
  },
  te: {
    temperature: 'ఉష్ణోగ్రత',
    feelsLike: 'అనిపించేది',
    dewPoint: 'మంచు బిందువు',
    rainfall: 'వర్షపాతం (1 గం.)',
    cloudCover: 'మేఘాలు',
    windSpeed: 'గాలి వేగం',
    fungalRisk: 'శిలీంధ్ర ప్రమాదం',
    riskHigh: 'అధిక తెగులు ప్రమాదం',
    riskModerate: 'మధ్యస్థం',
    riskLow: 'తక్కువ ప్రమాదం',
    dryCanopy: 'పొడి ఆకులు · పిచికారీకి అనుకూలం',
    activeRain: 'వర్షం · మందు కొట్టుకుపోయే ప్రమాదం',
    searchPlaceholder: 'గ్రామం లేదా జిల్లా పేరు రాయండి...',
    searchBtn: 'వెతుకు',
    updatedAt: 'అప్‌డేట్',
    owmVerified: 'OpenWeatherMap లైవ్',
    thermalOptimal: 'పంట పెరుగుదలకు అనుకూలం',
    thermalHot: 'అధిక ఎండ · ఉదయం నీరు పెట్టండి',
    thermalCool: 'చల్లని వాతావరణం'
  },
  kn: {
    temperature: 'ತಾಪಮಾನ',
    feelsLike: 'ಅನುಭವ',
    dewPoint: 'ಇಬ್ಬನಿ ಬಿಂದು',
    rainfall: 'ಮಳೆ ಪ್ರಮಾಣ (1 ಗಂ.)',
    cloudCover: 'ಮೋಡ',
    windSpeed: 'ಗಾಳಿಯ ವೇಗ',
    fungalRisk: 'ಶಿಲೀಂಧ್ರ ಅಪಾಯ',
    riskHigh: 'ಅಧಿಕ ರೋಗ ಅಪಾಯ',
    riskModerate: 'ಮಧ್ಯಮ',
    riskLow: 'ಕಡಿಮೆ ಅಪಾಯ',
    dryCanopy: 'ಒಣ ಎಲೆ · ಸಿಂಪಡಣೆಗೆ ಸುರಕ್ಷಿತ',
    activeRain: 'ಮಳೆ · ಔಷಧಿ ತೊಳೆದುಹೋಗುವ ಅಪಾಯ',
    searchPlaceholder: 'ಗ್ರಾಮ ಅಥವಾ ಜಿಲ್ಲೆಯ ಹೆಸರು ನಮೂದಿಸಿ...',
    searchBtn: 'ಹುಡುಕಿ',
    updatedAt: 'ಅಪ್‌ಡೇಟ್',
    owmVerified: 'OpenWeatherMap ಲೈವ್',
    thermalOptimal: 'ಬೆಳೆ ಬೆಳವಣಿಗೆಗೆ ಸೂಕ್ತ',
    thermalHot: 'ಅಧಿಕ ಬಿಸಿಲು · ಬೆಳಿಗ್ಗೆ ನೀರು ಹಾಯಿಸಿ',
    thermalCool: 'ತಂಪಾದ ವಾತಾವರಣ'
  },
  ta: {
    temperature: 'வெப்பநிலை',
    feelsLike: 'உணர்வு',
    dewPoint: 'பனி நிலை',
    rainfall: 'மழைப்பொழிவு (1 மணி)',
    cloudCover: 'மேகமூட்டம்',
    windSpeed: 'காற்றின் வேகம்',
    fungalRisk: 'பூஞ்சை அபாயம்',
    riskHigh: 'அதிக நோய் அபாயம்',
    riskModerate: 'மிதமானது',
    riskLow: 'குறைந்த அபாயம்',
    dryCanopy: 'உலர்ந்த இலை · தெளிக்க உகந்தது',
    activeRain: 'மழை · மருந்து வீணாகும் அபாயம்',
    searchPlaceholder: 'கிராமம் அல்லது மாவட்ட பெயர்...',
    searchBtn: 'தேடு',
    updatedAt: 'புதுப்பிப்பு',
    owmVerified: 'OpenWeatherMap நேரலை',
    thermalOptimal: 'பயிர் வளர்ச்சிக்கு உகந்தது',
    thermalHot: 'அதிக வெப்பம் · காலையில் நீர் பாய்ச்சவும்',
    thermalCool: 'குளிர்ந்த வானிலை'
  }
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  currentLang,
  highContrast,
  weather,
  isLoading,
  currentRegion,
  customLocationLabel,
  onSelectRegion,
  onSearchCity,
  onDetectGps,
  onRefresh
}) => {
  const t = TRANSLATIONS[currentLang];
  const wl = WIDGET_LABELS[currentLang] || WIDGET_LABELS.en;

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  const temp = weather?.temperature ?? 28;
  const feelsLike = weather?.apparentTemperature ?? 29;
  const dewPoint = weather?.dewPoint ?? 21.4;
  const humidity = weather?.humidity ?? 70;
  const rainfallMm = weather?.rainfallMm ?? 0;
  const cloudCover = weather?.cloudCover ?? 15;
  const windSpeed = weather?.windSpeed ?? 6.5;
  const soilMoisture = weather?.soilMoisture ?? 38;
  const sprayCondition = weather?.sprayCondition ?? 'optimal';
  const sprayText = weather?.sprayConditionText || t.optimalSpray;
  const locationDisplay =
    customLocationLabel || weather?.locationName || currentRegion.name[currentLang] || currentRegion.name.en;

  const fungalRiskLabel =
    humidity >= 80 ? wl.riskHigh : humidity >= 55 ? wl.riskModerate : wl.riskLow;
  const fungalRiskColor =
    humidity >= 80
      ? 'text-[#ba1a1a]'
      : humidity >= 55
        ? 'text-amber-700'
        : 'text-[#1b6d24]';

  const thermalStatus =
    temp > 34 ? wl.thermalHot : temp < 18 ? wl.thermalCool : wl.thermalOptimal;

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    onSearchCity(trimmed);
    setShowSearchBox(false);
  };

  return (
    <div
      className={`rounded-2xl border transition-all p-4 sm:p-5 ${
        highContrast
          ? 'bg-[#002117] border-white/30 text-white'
          : 'bg-white border-[#c0c9c3] text-[#161d19] shadow-sm'
      }`}
    >
      {/* Top Bar: Location, Source & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#dde4de]/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              highContrast
                ? 'bg-[#1b4d3e] text-[#a0f399] border border-[#a0f399]/40'
                : 'bg-[#eef5ef] text-[#003629] border border-[#a0f399]'
            }`}
          >
            {rainfallMm > 0 ? (
              <CloudRain className="w-5 h-5 text-sky-600" />
            ) : cloudCover > 50 ? (
              <Cloud className="w-5 h-5 text-[#1b4d3e]" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className={`font-display text-sm sm:text-base font-bold ${
                  highContrast ? 'text-white' : 'text-[#003629]'
                }`}
              >
                {t.fieldWeather}
              </h2>
              <span className="text-xs text-[#707974]" aria-hidden="true">
                ·
              </span>
              <span
                className={`text-xs font-medium ${
                  highContrast ? 'text-[#a0f399]' : 'text-[#1b6d24]'
                }`}
              >
                {weather?.conditionText || 'Clear Sky'}
              </span>
              <span className="text-xs text-[#707974]" aria-hidden="true">
                ·
              </span>
              <span
                className={`text-[11px] font-medium ${
                  highContrast ? 'text-[#baeed9]' : 'text-[#56605b]'
                }`}
              >
                {wl.owmVerified}
                {weather?.lastUpdated ? ` (${wl.updatedAt} ${weather.lastUpdated})` : ''}
              </span>
            </div>

            {/* Location Picker & GPS Trigger */}
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className={`inline-flex items-center gap-1 text-xs font-bold transition-colors py-0.5 ${
                    highContrast
                      ? 'text-[#a0f399] hover:text-white'
                      : 'text-[#161d19] hover:text-[#1b6d24]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{locationDisplay}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {isRegionOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsRegionOpen(false)}
                    />
                    <div className="absolute left-0 mt-1.5 w-64 bg-white text-[#161d19] rounded-2xl shadow-xl border border-[#c0c9c3] py-2 z-50">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#56605b] border-b border-[#dde4de]">
                        {t.fieldLocation}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegionOpen(false);
                          onDetectGps();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-[#1b6d24] hover:bg-[#eef5ef] flex items-center gap-2 transition-colors"
                      >
                        <Crosshair className="w-4 h-4" />
                        <span>{t.autoGps}</span>
                      </button>
                      {REGION_PRESETS.map((reg) => {
                        const active = currentRegion.id === reg.id && !customLocationLabel;
                        return (
                          <button
                            type="button"
                            key={reg.id}
                            onClick={() => {
                              onSelectRegion(reg);
                              setIsRegionOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-[#f4fbf4] flex items-center justify-between ${
                              active ? 'bg-[#eef5ef] text-[#1b6d24] font-bold' : ''
                            }`}
                          >
                            <span>{reg.name[currentLang] || reg.name.en}</span>
                            {active && <Check className="w-3.5 h-3.5 text-[#1b6d24]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Search City, GPS, Refresh, Spraying Status */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setShowSearchBox(!showSearchBox)}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              highContrast
                ? 'bg-[#1b4d3e] text-white border-white/25 hover:bg-[#256653]'
                : 'bg-[#f4fbf4] text-[#003629] border-[#c0c9c3] hover:bg-[#e8f0e9]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#1b6d24]" />
            <span>{t.fieldLocation}</span>
          </button>

          <button
            type="button"
            onClick={onDetectGps}
            disabled={isLoading}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              highContrast
                ? 'bg-[#1b4d3e] text-[#a0f399] border-white/25 hover:bg-[#256653]'
                : 'bg-[#eef5ef] text-[#003629] border-[#a0f399] hover:bg-[#e0ede2]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-[#1b6d24]" />
            <span>GPS</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh live OpenWeatherMap data"
            className={`min-h-[38px] min-w-[38px] p-2 rounded-xl border flex items-center justify-center transition-colors ${
              highContrast
                ? 'bg-[#1b4d3e] text-white border-white/25 hover:bg-[#256653]'
                : 'bg-[#f4fbf4] text-[#003629] border-[#c0c9c3] hover:bg-[#e8f0e9]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable City/Village Search Input */}
      {showSearchBox && (
        <form
          onSubmit={handleCitySubmit}
          className="mt-3 pt-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder={wl.searchPlaceholder}
            className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none ${
              highContrast
                ? 'bg-[#001710] border-white/30 text-white focus:border-[#a0f399]'
                : 'bg-[#f4fbf4] border-[#c0c9c3] text-[#161d19] focus:border-[#1b6d24]'
            }`}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
          >
            {wl.searchBtn}
          </button>
        </form>
      )}

      {/* 4-Column Agricultural Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* 1. Temperature Card */}
        <div
          className={`p-3.5 rounded-xl border ${
            highContrast
              ? 'bg-[#001710] border-white/20'
              : 'bg-[#f4fbf4] border-[#dde4de]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-semibold ${
                highContrast ? 'text-[#baeed9]' : 'text-[#56605b]'
              }`}
            >
              {wl.temperature}
            </span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span
              className={`font-display text-2xl font-extrabold ${
                highContrast ? 'text-white' : 'text-[#003629]'
              }`}
            >
              {temp}°C
            </span>
            <span
              className={`text-xs ${
                highContrast ? 'text-[#8abda9]' : 'text-[#56605b]'
              }`}
            >
              {wl.feelsLike} {feelsLike}°C
            </span>
          </div>
          <div
            className={`mt-2 pt-2 border-t text-[11px] flex items-center justify-between font-mono tabular-nums ${
              highContrast
                ? 'border-white/10 text-[#baeed9]'
                : 'border-[#dde4de] text-[#404945]'
            }`}
          >
            <span>
              {wl.dewPoint}: <strong>{dewPoint}°C</strong>
            </span>
            <span className="font-sans font-semibold text-[#1b6d24]">
              {thermalStatus}
            </span>
          </div>
        </div>

        {/* 2. Relative Humidity Card */}
        <div
          className={`p-3.5 rounded-xl border ${
            highContrast
              ? 'bg-[#001710] border-white/20'
              : 'bg-[#f4fbf4] border-[#dde4de]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-semibold ${
                highContrast ? 'text-[#baeed9]' : 'text-[#56605b]'
              }`}
            >
              {t.humidity}
            </span>
            <Droplets className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline justify-between gap-2 font-mono tabular-nums">
            <span
              className={`font-display text-2xl font-extrabold ${
                highContrast ? 'text-white' : 'text-[#003629]'
              }`}
            >
              {humidity}%
            </span>
            <span className={`font-sans text-xs font-bold ${fungalRiskColor}`}>
              {fungalRiskLabel}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#dde4de] overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                humidity >= 80
                  ? 'bg-[#ba1a1a]'
                  : humidity >= 55
                    ? 'bg-amber-500'
                    : 'bg-[#1b6d24]'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, humidity))}%` }}
            />
          </div>
          <div
            className={`mt-1.5 text-[11px] flex items-center justify-between font-mono tabular-nums ${
              highContrast ? 'text-[#baeed9]' : 'text-[#404945]'
            }`}
          >
            <span>{t.soilMoisture}</span>
            <strong>{soilMoisture}%</strong>
          </div>
        </div>

        {/* 3. Rainfall & Precipitation Card */}
        <div
          className={`p-3.5 rounded-xl border ${
            highContrast
              ? 'bg-[#001710] border-white/20'
              : 'bg-[#f4fbf4] border-[#dde4de]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-semibold ${
                highContrast ? 'text-[#baeed9]' : 'text-[#56605b]'
              }`}
            >
              {wl.rainfall}
            </span>
            <CloudRain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span
              className={`font-display text-2xl font-extrabold ${
                highContrast ? 'text-white' : 'text-[#003629]'
              }`}
            >
              {rainfallMm.toFixed(1)} mm
            </span>
            <span
              className={`text-xs ${
                highContrast ? 'text-[#8abda9]' : 'text-[#56605b]'
              }`}
            >
              {wl.cloudCover} {cloudCover}%
            </span>
          </div>
          <div
            className={`mt-2 pt-2 border-t text-[11px] flex items-center justify-between ${
              highContrast
                ? 'border-white/10 text-[#baeed9]'
                : 'border-[#dde4de] text-[#404945]'
            }`}
          >
            <span
              className={`font-semibold ${
                rainfallMm > 0 ? 'text-[#ba1a1a]' : 'text-[#1b6d24]'
              }`}
            >
              {rainfallMm > 0 ? wl.activeRain : wl.dryCanopy}
            </span>
          </div>
        </div>

        {/* 4. Wind & Spraying Advisory Card */}
        <div
          className={`p-3.5 rounded-xl border ${
            highContrast
              ? 'bg-[#001710] border-white/20'
              : 'bg-[#f4fbf4] border-[#dde4de]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-semibold ${
                highContrast ? 'text-[#baeed9]' : 'text-[#56605b]'
              }`}
            >
              {wl.windSpeed}
            </span>
            <Wind className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span
              className={`font-display text-2xl font-extrabold ${
                highContrast ? 'text-white' : 'text-[#003629]'
              }`}
            >
              {windSpeed} km/h
            </span>
          </div>
          <div
            className={`mt-2 pt-2 border-t text-[11px] flex items-center gap-1.5 ${
              highContrast ? 'border-white/10' : 'border-[#dde4de]'
            }`}
          >
            {sprayCondition === 'optimal' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6d24] flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
            )}
            <span
              className={`font-bold truncate ${
                sprayCondition === 'optimal'
                  ? highContrast
                    ? 'text-[#a0f399]'
                    : 'text-[#1b6d24]'
                  : 'text-[#ba1a1a]'
              }`}
            >
              {sprayText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
