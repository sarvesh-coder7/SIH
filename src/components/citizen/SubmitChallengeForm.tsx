import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { challengeService } from '../../services/challengeService';
import confetti from 'canvas-confetti';
// Google Maps removed — using OpenStreetMap iframe embed instead (no API key required)
import {
  getCurrentGPS,
  buildLocationData,
  stampPhotoWithAddress,
  isGPSAcceptable,
  getAccuracyLabel,
  type GPSData,
  type LocationData,
} from '../../services/geotagService';
import {
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Eye,
  Info,
  Clock,
  Trash2,
  X,
  Crosshair,
  Image as ImageIcon,
  Plus,
  Edit3,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  Paperclip,
  Mic,
  Copy,
  Users,
} from 'lucide-react';
import { ChallengeCategory, ChallengeUrgency } from '../../types';

export const getCommunityImpactLevel = (count: number): { level: 'HIGH' | 'MEDIUM' | 'LOW'; badgeClass: string } => {
  if (count >= 500) {
    return { level: 'HIGH', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200' };
  }
  if (count >= 100) {
    return { level: 'MEDIUM', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  return { level: 'LOW', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
};

interface AttachedPhoto {
  id: string;
  type: 'image';
  url: string;          // displayed URL (stamped image for camera captures)
  originalUrl?: string; // unmodified camera capture — never re-stamped
  caption?: string;
  timestamp: string;
  gpsCoordinates?: { lat: number; lng: number };
  geotagLocation?: string;
  accuracy?: number;
  isGeotagged?: boolean;
  fileName?: string;
  fileSize?: string;
  source?: 'camera' | 'upload' | 'sample';
  locationData?: LocationData; // full GPS + reverse-geocoded address metadata
}

interface AttachedFile {
  id: string;
  type: 'video' | 'document';
  name: string;
  size: string;
  url?: string;
}

const CITIZEN_CATEGORIES = [
  { id: 'Water Resources', label: 'Water', icon: '💧', desc: 'Drinking water, borewells, ponds, pipelines' },
  { id: 'Agriculture & Rural Economy', label: 'Agriculture', icon: '🌾', desc: 'Crops, irrigation, storage, livestock' },
  { id: 'Education', label: 'Education', icon: '📚', desc: 'School facilities, books, smart classrooms' },
  { id: 'Healthcare & Telemedicine', label: 'Healthcare', icon: '🏥', desc: 'Clinics, medicines, ambulances, health centers' },
  { id: 'Roads & Transport', label: 'Roads & Transport', icon: '🛣️', desc: 'Potholes, broken bridges, village connectivity' },
  { id: 'Sanitation & Waste Management', label: 'Sanitation', icon: '🧹', desc: 'Drainage, garbage disposal, public toilets' },
  { id: 'Environment & Forest Livelihood', label: 'Environment', icon: '🌲', desc: 'Forestry, pollution, clean energy, soil' },
  { id: 'Renewable Energy & Power', label: 'Electricity', icon: '⚡', desc: 'Power cuts, solar lights, broken transformers' },
  { id: 'Urban Infrastructure & Mobility', label: 'Public Infrastructure', icon: '🏛️', desc: 'Community halls, streetlights, markets' },
  { id: 'Accessibility', label: 'Accessibility', icon: '♿', desc: 'Ramps, elderly & disabled access' },
  { id: 'Livelihood', label: 'Livelihood', icon: '💼', desc: 'Self-help groups, craft value addition, markets' },
  { id: 'Other', label: 'Other', icon: '📌', desc: 'Any other general community issue' },
];

export const SubmitChallengeForm: React.FC = () => {
  const {
    currentUser,
    showToast,
    refreshData,
    navigateToChallenge,
    setCurrentView,
  } = useApp();

  // Wizard Step: 1 = Describe, 2 = Location, 3 = Evidence, 4 = Review, 5 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedChallengeId, setSubmittedChallengeId] = useState<string | null>(null);
  const [submittedChallengeDbId, setSubmittedChallengeDbId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);

  // STEP 1: Describe the Problem
  const [problemTitle, setProblemTitle] = useState('');
  const [whatIsHappening, setWhatIsHappening] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Water Resources');
  const [affectedPeopleCount, setAffectedPeopleCount] = useState<string>('');
  const [urgency, setUrgency] = useState<ChallengeUrgency>('High');
  const [frequency, setFrequency] = useState<'Daily' | 'Seasonal' | 'Recurring Periodic' | 'One-Time Event'>('Daily');
  const [expectedImpact, setExpectedImpact] = useState<string>('Restoring functional community infrastructure and public well-being.');
  const [uploadProgressText, setUploadProgressText] = useState<string>('');

  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDesc, setIsListeningDesc] = useState(false);

  const handleVoiceType = async (field: 'title' | 'desc') => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast('error', 'Not Supported', 'Voice typing is not supported in this browser.');
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      
      const isListeningSetter = field === 'title' ? setIsListeningTitle : setIsListeningDesc;
      const valueSetter = field === 'title' ? setProblemTitle : setWhatIsHappening;

      recognition.onstart = () => {
        isListeningSetter(true);
        showToast('info', 'Listening...', 'Please speak now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        valueSetter((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = () => {
        isListeningSetter(false);
        showToast('error', 'Error', 'Could not recognize speech.');
      };

      recognition.onend = () => {
        isListeningSetter(false);
      };

      recognition.start();
    } catch (err) {
      showToast('error', 'Permission Denied', 'Microphone permission is required for voice typing.');
    }
  };

  // STEP 2: Location
  // ─── Location method: null = not yet chosen, 'gps' = GPS selected, 'manual' = manual entry ───
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual' | null>(null);

  // GPS state — set when citizen clicks "Use My Current Location"
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [geoAccuracy, setGeoAccuracy] = useState<number | null>(null);
  const [gpsTimestamp, setGpsTimestamp] = useState<number | null>(null);
  const [gpsFormattedAddress, setGpsFormattedAddress] = useState<string | null>(null);

  // Manual entry state — all empty by default, no pre-filled demo values
  const [district, setDistrict] = useState<string>('');
  const [block, setBlock] = useState('');
  const [village, setVillage] = useState('');

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // ── Canonical location helper ──────────────────────────────────────────────
  // Returns the single source of truth for the selected location.
  // Used by Review, validation, and submit handler — they all call this function.
  const getCanonicalLocation = () => {
    if (gps && gps.lat && gps.lng) {
      return {
        method: (locationMethod || 'gps') as 'gps' | 'manual',
        displayAddress: gpsFormattedAddress || `${gps.lat.toFixed(4)}°N, ${gps.lng.toFixed(4)}°E`,
        latitude: gps.lat,
        longitude: gps.lng,
        accuracy: geoAccuracy,
        district: district.trim() || 'Ranchi',
        block: block.trim() || 'Ranchi Sadar',
        village: village.trim() || 'Community Area',
      };
    }
    if (district && district.trim()) {
      const parts = [village.trim(), block.trim(), district.trim()].filter(Boolean);
      return {
        method: 'manual' as const,
        displayAddress: parts.join(', ') || district,
        latitude: 23.3441,
        longitude: 85.3096,
        accuracy: null,
        district: district.trim(),
        block: block.trim() || district.trim(),
        village: village.trim() || 'Main Locality',
      };
    }
    // Safe default fallback so complaint submission never fails due to location
    return {
      method: 'manual' as const,
      displayAddress: 'Ranchi, Jharkhand',
      latitude: 23.3441,
      longitude: 85.3096,
      accuracy: null,
      district: 'Ranchi',
      block: 'Ranchi Sadar',
      village: 'Jharkhand',
    };
  };

  // STEP 3: Evidence (Multiple Photos, Video, Document)
  // Starts EMPTY — no demo/sample images. Photos are added only when the citizen
  // captures via camera or uploads from gallery.
  const [photos, setPhotos] = useState<AttachedPhoto[]>([]);
  const [otherFiles, setOtherFiles] = useState<AttachedFile[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<AttachedPhoto | null>(null);

  // Live Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVideoRecordOpen, setIsVideoRecordOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Per-video interactive state: false = autoplay/muted preview, true = clicked → full controls + sound
  const [videoPlayStates, setVideoPlayStates] = useState<Record<string, boolean>>({});

  // STEP 4: Review & Confirmation
  const [confirmAccuracy, setConfirmAccuracy] = useState<boolean>(true);

  // File Input Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoCaptureRef = useRef<HTMLInputElement>(null);

  // Validation State
  const [photoValidationError, setPhotoValidationError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // PHOTO-SESSION GEOTAG STATE
  // Scoped to the active camera capture session only.
  // Cleared on every handleCloseCamera / retake.
  // Completely separate from the Step 2 form-level GPS state.
  // ─────────────────────────────────────────────────────────────────────────────
  type PhotoGpsStatus = 'idle' | 'locating' | 'geocoding' | 'ready' | 'error';
  const [photoGpsStatus, setPhotoGpsStatus] = useState<PhotoGpsStatus>('idle');
  const [photoGpsData, setPhotoGpsData] = useState<GPSData | null>(null);
  const [photoLocationData, setPhotoLocationData] = useState<LocationData | null>(null);
  const [photoGpsError, setPhotoGpsError] = useState<string | null>(null);
  // The unmodified canvas capture — used as stamp source, never re-stamped
  const originalCaptureRef = useRef<string | null>(null);

  // Geolocation Handler — also reverse geocodes to get a human-readable address
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    setLocationSuccessMsg(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationError('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    // Check permission first if API supports it
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      if (permissionStatus.state === 'denied') {
        setIsLocating(false);
        setLocationError('Location permission is required to geotag this photo. Please allow location access in your browser settings.');
        showToast('error', 'Permission Denied', 'Please allow location access in your browser settings.');
        return;
      }
    } catch {
      // Permissions API not supported — proceed to getCurrentPosition
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const acc = Number(position.coords.accuracy.toFixed(1));

        setGps({ lat, lng });
        setGeoAccuracy(acc);
        setGpsTimestamp(position.timestamp);

        // Reverse geocode via OSM Nominatim (reuse geotagService)
        setLocationSuccessMsg('📍 Getting your address...');
        try {
          const locationData = await buildLocationData({
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            timestamp: position.timestamp,
          });
          const addr = locationData?.formattedAddress || null;
          setGpsFormattedAddress(addr);

          // Automatically populate District, Block, and Village from reverse geocoding
          if (locationData?.parsedAddress) {
            const parsed = locationData.parsedAddress;
            if (parsed.district) {
              const matchedDistrict = JHARKHAND_DISTRICTS.find(
                (d) =>
                  d.toLowerCase() === parsed.district?.toLowerCase() ||
                  parsed.district?.toLowerCase().includes(d.toLowerCase()) ||
                  d.toLowerCase().includes(parsed.district?.toLowerCase() || '')
              );
              setDistrict(matchedDistrict || parsed.district.replace(/\s*district\s*/i, '').trim());
            }

            if (parsed.locality) {
              setVillage(parsed.locality);
            }
          }

          if (addr) {
            const parts = addr.split(',').map((p) => p.trim());
            if (parts.length > 2) {
              setBlock((prev) => prev || parts[1]);
            } else if (parts.length > 1) {
              setBlock((prev) => prev || parts[0]);
            }
            if (parts.length > 0) {
              setVillage((prev) => prev || parts[0]);
            }
          }

          setLocationSuccessMsg(
            `✓ Location detected automatically (${lat.toFixed(6)}, ${lng.toFixed(6)}) ±${acc}m`
          );
        } catch {
          setGpsFormattedAddress(null);
          setLocationSuccessMsg(`✓ Location detected automatically (${lat.toFixed(6)}, ${lng.toFixed(6)}) ±${acc}m`);
        }

        // GPS is now the active location method
        setLocationMethod('gps');
        setIsLocating(false);
        showToast('success', 'Location Captured', 'GPS coordinates identified via your device.');
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission is required. Please allow access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Unable to determine your current location. Please enable location and try again.');
            break;
          default:
            setLocationError('GPS location unavailable. You can enter the location manually below.');
        }
        showToast('info', 'GPS Unavailable', 'You can select your District, Block, and Village manually.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Camera Open Handler
  // Starts camera stream AND begins GPS acquisition in parallel.
  const handleOpenCamera = async () => {
    // Reset all photo-session state for a fresh capture
    setPhotoGpsStatus('idle');
    setPhotoGpsData(null);
    setPhotoLocationData(null);
    setPhotoGpsError(null);
    originalCaptureRef.current = null;

    setIsCameraOpen(true);
    setCameraError(null);

    // Start camera stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, showing simulated capture fallback', err);
      setCameraError('Camera access unavailable. You can upload photos directly from your gallery.');
    }

    // Concurrently start GPS acquisition for this photo session
    setPhotoGpsStatus('locating');
    try {
      const gpsData = await getCurrentGPS();

      if (!isGPSAcceptable(gpsData.accuracy)) {
        setPhotoGpsStatus('error');
        setPhotoGpsError(
          `Location accuracy is too low (±${Math.round(gpsData.accuracy)}m). Please move to an open area and try again.`
        );
        setPhotoGpsData(gpsData); // still store it so user can see the coordinates
        return;
      }

      setPhotoGpsData(gpsData);
      setPhotoGpsStatus('geocoding');

      // Reverse geocode using OSM Nominatim
      const locationData = await buildLocationData(gpsData);

      if (!locationData || !locationData.formattedAddress) {
        setPhotoGpsStatus('error');
        setPhotoGpsError('Unable to determine the address from your current location. Please try again.');
        return;
      }

      setPhotoLocationData(locationData);
      setPhotoGpsStatus('ready');
    } catch (errMsg) {
      setPhotoGpsStatus('error');
      setPhotoGpsError(typeof errMsg === 'string' ? errMsg : 'Unable to determine your current location. Please try again.');
    }
  };

  // Capture Photo from Live Stream
  // Captures original image ONCE, then stamps it with the verified address.
  // Never re-stamps an already-stamped image.
  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw original frame — this is the clean, unmodified capture
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const originalDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Store in ref (not state) to avoid triggering re-renders
    originalCaptureRef.current = originalDataUrl;

    const captureId = `photo-${Date.now()}`;
    const captureTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 2. If we have a verified address, stamp it onto the original
    if (photoGpsStatus === 'ready' && photoLocationData) {
      try {
        const stampedDataUrl = await stampPhotoWithAddress(
          originalDataUrl,
          `📍 ${photoLocationData.formattedAddress}`
        );

        const newPhoto: AttachedPhoto = {
          id: captureId,
          type: 'image',
          url: stampedDataUrl,           // displayed: stamped
          originalUrl: originalDataUrl,  // stored: unmodified
          caption: 'Captured on site',
          timestamp: captureTimestamp,
          gpsCoordinates: {
            lat: Number(photoLocationData.latitude.toFixed(6)),
            lng: Number(photoLocationData.longitude.toFixed(6)),
          },
          geotagLocation: photoLocationData.formattedAddress,
          accuracy: photoLocationData.accuracy,
          isGeotagged: true,
          source: 'camera',
          fileName: `camera_snap_${captureId}.jpg`,
          fileSize: '~1.2 MB',
          locationData: photoLocationData,
        };

        setPhotos((prev) => [...prev, newPhoto]);
        showToast('success', 'Geotagged Photo Captured', `📍 ${photoLocationData.formattedAddress}`);
      } catch (stampErr) {
        // Stamp failed — save original without stamp, still geotagged in metadata
        console.warn('[geotagService] Stamping failed, saving unstamped photo:', stampErr);
        const newPhoto: AttachedPhoto = {
          id: captureId,
          type: 'image',
          url: originalDataUrl,
          originalUrl: originalDataUrl,
          caption: 'Captured on site',
          timestamp: captureTimestamp,
          gpsCoordinates: {
            lat: Number(photoLocationData.latitude.toFixed(6)),
            lng: Number(photoLocationData.longitude.toFixed(6)),
          },
          geotagLocation: photoLocationData.formattedAddress,
          accuracy: photoLocationData.accuracy,
          isGeotagged: true,
          source: 'camera',
          fileName: `camera_snap_${captureId}.jpg`,
          fileSize: '~1.2 MB',
          locationData: photoLocationData,
        };
        setPhotos((prev) => [...prev, newPhoto]);
        showToast('success', 'Photo Captured', 'Geotagged in metadata. Address stamp failed but coordinates are saved.');
      }
    } else {
      // No verified address — save photo without stamp
      // Use whatever GPS data we have in metadata, but do NOT show a fake address
      const hasGps = photoGpsData !== null;
      const newPhoto: AttachedPhoto = {
        id: captureId,
        type: 'image',
        url: originalDataUrl,
        originalUrl: originalDataUrl,
        caption: 'Captured on site',
        timestamp: captureTimestamp,
        gpsCoordinates: hasGps
          ? {
              lat: Number(photoGpsData!.latitude.toFixed(6)),
              lng: Number(photoGpsData!.longitude.toFixed(6)),
            }
          : undefined,
        geotagLocation: undefined, // no verified address — do NOT invent one
        accuracy: hasGps ? photoGpsData!.accuracy : undefined,
        isGeotagged: false,
        source: 'camera',
        fileName: `camera_snap_${captureId}.jpg`,
        fileSize: '~1.2 MB',
      };
      setPhotos((prev) => [...prev, newPhoto]);

      const statusMessage =
        photoGpsStatus === 'error'
          ? 'Photo captured. Location could not be determined.'
          : photoGpsStatus === 'locating' || photoGpsStatus === 'geocoding'
          ? 'Photo captured. Location is still being detected.'
          : 'Photo captured without location data.';
      showToast('success', 'Photo Captured', statusMessage);
    }

    handleCloseCamera();
  };

  // Close Camera — clears ALL photo-session geotag state (retake safety)
  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setIsVideoRecordOpen(false);
    if (isRecording) handleStopRecording();

    // Clear photo-session state so retake gets a fresh GPS reading
    setPhotoGpsStatus('idle');
    setPhotoGpsData(null);
    setPhotoLocationData(null);
    setPhotoGpsError(null);
    originalCaptureRef.current = null;
  };

  // Video Camera Handlers
  const handleOpenVideoCamera = async () => {
    setIsVideoRecordOpen(true);
    setCameraError(null);
    setRecordingTime(0);
    setIsRecording(false);
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true, // Ask for mic
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera/Mic access denied or unavailable', err);
      setCameraError('Camera or Microphone access unavailable. Please check permissions.');
    }
  };

  const handleStartRecording = () => {
    if (!cameraStream) return;
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const newVideo: AttachedFile = {
        id: `video-${Date.now()}`,
        type: 'video',
        name: `recorded_video_${Date.now()}.webm`,
        size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        url,
      };

      setOtherFiles((prev) => [...prev, newVideo]);
      showToast('success', 'Video Recorded', 'Added to your evidence gallery.');
      handleCloseCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };


  // Photo Upload Handler (Files from disk / gallery)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: AttachedPhoto[] = [];
    Array.from(files).forEach((file: File, idx) => {
      const url = URL.createObjectURL(file);
      newPhotos.push({
        id: `upload-photo-${Date.now()}-${idx}`,
        type: 'image',
        url,
        caption: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Uploaded photos do NOT have real-time GPS capture — never fake-geotag them
        gpsCoordinates: undefined,
        geotagLocation: undefined,
        accuracy: undefined,
        isGeotagged: false,
        source: 'upload',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
    setPhotoValidationError(null);
    showToast('success', 'Photos Added', `${newPhotos.length} photo(s) added to evidence.`);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Remove Photo
  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (updated.length === 0 && otherFiles.some(f => f.type === 'video')) {
        setPhotoValidationError('Please attach at least one photo along with the video. A video alone is not sufficient evidence.');
      }
      return updated;
    });
  };

  // Video / Doc Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'document') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (fileType === 'video' && photos.length === 0) {
      setPhotoValidationError('Please attach at least one photo along with the video. A video alone is not sufficient evidence.');
    }

    const newFiles: AttachedFile[] = [];
    Array.from(files).forEach((file: File, idx) => {
      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `file-${Date.now()}-${idx}`,
        type: fileType,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url,
      });
    });

    setOtherFiles((prev) => [...prev, ...newFiles]);
    showToast('success', `${fileType === 'video' ? 'Video' : 'Document'} Attached`, 'File added to evidence.');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoCaptureRef.current) videoCaptureRef.current.value = '';
  };

  // Submit Handler — uses getCanonicalLocation() as single source of truth
  const handleSubmitProblem = async () => {
    if (!problemTitle.trim() || !whatIsHappening.trim()) {
      showToast('error', 'Missing Information', 'Please provide a title and describe what is happening.');
      setStep(1);
      return;
    }

    if (!confirmAccuracy) {
      setConfirmAccuracy(true);
    }

    const canonicalLoc = getCanonicalLocation();
    setIsSubmitting(true);

    try {
      const newChallenge = await challengeService.createChallenge({
        title: problemTitle.trim(),
        description: whatIsHappening.trim(),
        category: (selectedCategory || 'Rural Infrastructure & Connectivity') as ChallengeCategory,
        district: canonicalLoc.district || 'Ranchi',
        block: canonicalLoc.block || 'Ranchi Sadar',
        village: canonicalLoc.village || 'Main Locality',
        gpsCoordinates: canonicalLoc.latitude != null
          ? { lat: canonicalLoc.latitude, lng: canonicalLoc.longitude! }
          : { lat: 23.3441, lng: 85.3096 },
        affectedPopulation: Math.max(1, parseInt(affectedPeopleCount, 10) || 1),
        frequency: frequency || 'Daily',
        urgency: urgency || 'High',
        expectedImpact: expectedImpact || 'Restoring functional community infrastructure and public well-being.',
        submittedBy: {
          userId: currentUser?.id || 'citizen-reporter',
          userName: currentUser?.name || 'Citizen Submitter',
          userRole: currentUser?.role || 'Citizen',
          contactNumber: currentUser?.phone || '',
        },
        evidenceUrls: [
          ...photos.map((p) => ({
            type: 'image' as const,
            url: p.url,
            caption: p.caption || 'Site photo',
            gpsCoordinates: p.gpsCoordinates,
            geotagLocation: p.geotagLocation,
            accuracy: p.accuracy,
            isGeotagged: p.isGeotagged,
            timestamp: p.timestamp,
            source: p.source,
            fileName: p.fileName,
            fileSize: p.fileSize,
          })),
          ...otherFiles.map((f) => ({
            type: f.type,
            url: f.url || '',
            caption: f.name || (f.type === 'video' ? 'Site video evidence' : 'Attached document'),
            fileName: f.name,
            fileSize: f.size,
            source: 'upload' as const,
          })),
        ],
      });

      // Trigger Celebration Confetti safely
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (cErr) {
        console.warn('Confetti animation skipped:', cErr);
      }

      const finalTrackingId = newChallenge?.trackingId || newChallenge?.id || `JH-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      setSubmittedChallengeId(finalTrackingId);
      setSubmittedChallengeDbId(newChallenge?.id || finalTrackingId);
      setIsSubmitting(false);
      setStep(5); // Show Success Screen
      showToast('success', 'Problem Report Submitted Successfully! ✓', `Tracking ID: ${finalTrackingId}`);
      void refreshData().catch((rErr) => console.warn('Background refresh skipped:', rErr));
    } catch (err: any) {
      console.error('Submission failed with error:', err);
      setIsSubmitting(false);
      showToast('error', 'Submission Failed', err?.message || 'Something went wrong. Please check your internet connection and try again.');
    }
  };

  // =========================================================================
  // SUCCESS SCREEN (SECTION 15)
  // =========================================================================
  if (step === 5) {
    const activeTrackingId = submittedChallengeId || submittedChallengeDbId || 'JH-2026-REGISTRATION';

    const handleCopyTrackingId = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(activeTrackingId);
        setCopiedTrackingId(true);
        showToast('info', 'Copied!', 'Tracking ID copied to clipboard.');
        setTimeout(() => setCopiedTrackingId(false), 3000);
      }
    };

    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-8 font-sans-body">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            Community Report Registered &bull; Govt of Jharkhand
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Problem Report Submitted Successfully! ✓
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your complaint has been successfully registered.
          </p>
        </div>

        {/* Challenge ID Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Complaint Tracking ID</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Official Reference
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-xl sm:text-2xl font-mono font-black text-emerald-950 tracking-wide select-all text-left">
              {activeTrackingId}
            </div>
            <button
              type="button"
              onClick={handleCopyTrackingId}
              className="p-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-xl transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
              title="Copy Tracking ID"
            >
              {copiedTrackingId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTrackingId ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium text-left">
            Keep this ID to track the progress of your complaint.
          </p>

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-left flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Scale</span>
                <span className="text-xs font-bold text-slate-900">
                  {(parseInt(affectedPeopleCount, 10) || 0).toLocaleString()} people affected
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).badgeClass}`}>
              {getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).level} IMPACT
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-left space-y-1">
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Current Status: Registered & Queued for Verification</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Government review and university matching will appear on your tracking timeline in real time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateToChallenge(submittedChallengeDbId || activeTrackingId)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ring-2 ring-amber-400/30"
          >
            <Eye className="w-4 h-4" />
            <span>Track My Complaint</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('citizen-dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold text-sm rounded-xl border border-slate-300 cursor-pointer transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── VideoEvidenceCard ──────────────────────────────────────────────────────
  // Renders a single recorded/uploaded video inside the evidence grid.
  // Preview state: autoplay, muted, loop (browser-safe).
  // After user click: full controls, unmuted, plays with sound — stays in card.
  const VideoEvidenceCard: React.FC<{
    video: AttachedFile;
    isInteractive: boolean;
    onActivate: () => void;
    onRemove: () => void;
  }> = useCallback(
    ({ video, isInteractive, onActivate, onRemove }) => {
      const cardVideoRef = useRef<HTMLVideoElement>(null);

      // Autoplay as muted preview whenever the card first mounts or src changes
      useEffect(() => {
        const el = cardVideoRef.current;
        if (!el || !video.url) return;
        el.src = video.url;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.load();
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay blocked — still fine, user can click to play
          });
        }
      }, [video.url]);

      // When user activates interactive mode: unmute and show controls
      useEffect(() => {
        const el = cardVideoRef.current;
        if (!el) return;
        if (isInteractive) {
          el.muted = false;
          el.loop = false;
          const playPromise = el.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      }, [isInteractive]);

      const handleClick = () => {
        if (!isInteractive) {
          onActivate();
        }
      };

      return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
          <div
            className={`relative w-full aspect-[4/3] bg-slate-900 overflow-hidden ${!isInteractive ? 'cursor-pointer' : ''}`}
            onClick={handleClick}
          >
            <video
              ref={cardVideoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              loop
              preload="auto"
              {...(isInteractive ? { controls: true } : {})}
            />

            {/* Video badge — always visible */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-bold text-white shadow pointer-events-none">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Video</span>
            </div>

            {/* Click-to-play hint overlay — only shown in preview (muted) state */}
            {!isInteractive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-4 left-0 right-0 text-center text-[11px] text-white/80 font-medium px-3">
                  Tap to play with sound
                </span>
              </div>
            )}
          </div>

          {/* Filename footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <Video className="w-4 h-4 text-slate-500 shrink-0" />
            <p className="text-[12px] text-slate-600 font-medium truncate">{video.name}</p>
          </div>

          {/* Remove button */}
          <div className="px-3 pb-3 pt-2">
            <button
              type="button"
              onClick={onRemove}
              className="w-full py-2 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:bg-rose-200 transition-colors text-xs font-bold border border-rose-100"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans-body">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => setCurrentView('citizen-dashboard')}
              className="hover:text-amber-700 cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Report a Problem</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Report a Community Problem
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('citizen-dashboard')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* 4-Step Progress Indicator (Section 8) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-4 gap-4 text-center text-xs">
          {[
            { num: 1, label: 'Describe' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Evidence' },
            { num: 4, label: 'Review' },
          ].map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num as any);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-amber-100 text-slate-950 font-bold border border-amber-300'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 font-medium cursor-pointer'
                    : 'text-slate-600 bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="text-[11px] sm:text-xs">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: DESCRIBE THE PROBLEM (SECTION 9) */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              What problem did you notice?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Describe the problem naturally. The platform will handle technical routing.
            </p>
          </div>

          {/* Problem Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Problem Title <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g., Broken drinking water facility in Torpa village"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
              <button
                type="button"
                onClick={() => handleVoiceType('title')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors cursor-pointer ${
                  isListeningTitle ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                }`}
                title="Voice type"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              What is happening? <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={whatIsHappening}
                onChange={(e) => setWhatIsHappening(e.target.value)}
                placeholder="Tell us what is happening, where it is happening, and how it is affecting people..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => handleVoiceType('desc')}
                className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors cursor-pointer ${
                  isListeningDesc ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                }`}
                title="Voice type"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Tip: Explain how many families or children are affected and how long this issue has persisted.
            </p>
          </div>

          {/* Category Selector (Section 9) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Category (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {CITIZEN_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/40 text-slate-950 font-bold'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs font-bold">{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* People Affected Section (Section 2) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                How many people are affected? <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Estimated community count</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Input Box & Presets */}
              <div className="md:col-span-2 space-y-2.5">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    value={affectedPeopleCount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d+$/.test(val)) {
                        setAffectedPeopleCount(val);
                      }
                    }}
                    placeholder="e.g. 250"
                    className="w-full pl-11 pr-16 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    people
                  </span>
                </div>

                {/* Preset Quick Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-medium mr-1">Quick Select:</span>
                  {[50, 100, 250, 500, 1000, 2500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAffectedPeopleCount(String(preset))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        affectedPeopleCount === String(preset)
                          ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {preset.toLocaleString()}+
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Enter the approximate number of people directly affected by this problem.
                </p>
              </div>

              {/* Visual Impact Card */}
              <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-4 rounded-2xl border border-amber-200/90 flex flex-col justify-between space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>People Affected</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-950">
                    {parseInt(affectedPeopleCount, 10) ? parseInt(affectedPeopleCount, 10).toLocaleString() : '0'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    people in this community
                  </div>
                </div>
                <div className="pt-1">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).badgeClass}`}>
                    Community Impact: {getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Urgency & Frequency Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ChallengeUrgency)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Critical">Critical (Immediate danger or severe crisis)</option>
                <option value="High">High (Major daily disruption to public life)</option>
                <option value="Medium">Medium (Regular recurring inconvenience)</option>
                <option value="Low">Low (Minor / long-term improvement)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Occurrence Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Daily">Daily Persistent</option>
                <option value="Seasonal">Seasonal (Monsoon / Summer)</option>
                <option value="Recurring Periodic">Recurring Periodic</option>
                <option value="One-Time Event">One-Time Event</option>
              </select>
            </div>
          </div>

          {/* Step 1 CTA */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!problemTitle.trim() || !whatIsHappening.trim()) {
                  showToast('error', 'Required Fields', 'Please enter a problem title and brief description.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: LOCATION (SECTION 10) */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📍 Location Details</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Capture your GPS location on site or enter your district and village manually.
            </p>
          </div>

          {/* Primary GPS Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-amber-600" />
                  <span>Automatic GPS Geolocation</span>
                </span>
                <p className="text-xs text-slate-600">
                  Recommended if you are currently standing near the problem site.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isLocating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
            </div>

            {/* GPS Status */}
            {locationSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locationSuccessMsg}</span>
              </div>
            )}

            {locationError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            {/* ── GPS selected: show OSM map + address + coordinates ── */}
            {locationMethod === 'gps' && gps && (
              <div className="rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
                {/* OSM iframe — no API key, no Google popup */}
                <div className="relative h-[300px] sm:h-[380px] w-full bg-slate-100">
                  <iframe
                    title="OpenStreetMap location preview"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${gps.lng - 0.01},${gps.lat - 0.01},${gps.lng + 0.01},${gps.lat + 0.01}&layer=mapnik&marker=${gps.lat},${gps.lng}`}
                  />
                </div>

                {/* GPS metadata strip */}
                <div className="p-3.5 bg-emerald-50 border-t border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ Location detected automatically</span>
                  </div>

                  {gpsFormattedAddress && (
                    <div className="flex items-start gap-1.5 text-xs text-emerald-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                      <span>{gpsFormattedAddress}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-emerald-900">
                    <span>GPS Coordinates: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}</span>
                    {geoAccuracy && <span>Accuracy: ±{geoAccuracy} m</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual Location — alternative to GPS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Manual Location Entry
              </h3>
              {locationMethod === 'gps' && (
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                  GPS active — fields optional
                </span>
              )}
              {locationMethod === null && (
                <span className="text-[11px] text-amber-700 font-medium">
                  Enter if GPS is unavailable
                </span>
              )}
            </div>

            {/* When GPS is active, show a soft note instead of fully disabling fields */}
            {locationMethod === 'gps' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>Your GPS location is already selected above. You can optionally add manual details for reference, or leave these blank.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  District {locationMethod !== 'gps' && <span className="text-rose-600">*</span>}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (e.target.value) setLocationMethod('manual');
                  }}
                  className="w-full px-4 py-3 h-11 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">— Select District —</option>
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Block */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Block / Tehsil
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => {
                    setBlock(e.target.value);
                    if (e.target.value && locationMethod !== 'gps') setLocationMethod('manual');
                  }}
                  placeholder="Enter Block / Tehsil"
                  className="w-full px-4 py-3 h-11 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Village / Town */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Village / Ward / Landmark
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (e.target.value && locationMethod !== 'gps') setLocationMethod('manual');
                  }}
                  placeholder="Enter location"
                  className="w-full px-4 py-3 h-11 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const loc = getCanonicalLocation();
                if (!loc) {
                  showToast('error', 'Location Required',
                    'Please use GPS or select a District to continue.');
                  return;
                }
                setStep(3);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Add Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: EVIDENCE (SECTIONS 11-13) */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Add Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Photos or videos can help us understand the problem better. Adding evidence speeds up verification.
            </p>
          </div>

          {/* Evidence Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* 1. Open Camera */}
            <button
              type="button"
              onClick={handleOpenCamera}
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group h-full"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Open Camera</span>
              <span className="text-[10px] text-amber-900/80">Take photo on site</span>
            </button>

            {/* 2. Record Video */}
            <button
              type="button"
              onClick={handleOpenVideoCamera}
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group h-full"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Record Video</span>
              <span className="text-[10px] text-amber-900/80">Capture on site</span>
            </button>

            {/* 3. Upload Photos */}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group h-full"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Photos</span>
              <span className="text-[10px] text-slate-500">Select multiple images</span>
            </button>

            {/* 4. Upload Video */}
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'video/*';
                  fileInputRef.current.click();
                }
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group h-full"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Video</span>
              <span className="text-[10px] text-slate-500">Short clip (&lt; 30MB)</span>
            </button>

            {/* 5. Upload Document */}
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.pdf,.doc,.docx,.txt';
                  fileInputRef.current.click();
                }
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group h-full"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Document</span>
              <span className="text-[10px] text-slate-500">Letter or notice</span>
            </button>
          </div>

          {/* Validation Error Message */}
          {photoValidationError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2 shadow-sm font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p>{photoValidationError}</p>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={photoInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'document')}
          />
          <input
            ref={videoCaptureRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'video')}
          />

          {/* ── Evidence Gallery ──────────────────────────────────────── */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Attached Evidence ({photos.length + otherFiles.filter(f => f.type === 'video').length})
              </span>
              <span className="text-xs text-slate-500">
                You can add multiple photos and videos
              </span>
            </div>

            {photos.length === 0 && otherFiles.filter(f => f.type === 'video').length === 0 ? (
              /* ── Empty State ── */
              <div className={`py-14 px-6 rounded-2xl border-2 border-dashed text-center space-y-3 transition-colors ${
                photoValidationError
                  ? 'border-rose-400 bg-rose-50/50'
                  : 'border-slate-300 bg-slate-50/60'
              }`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  photoValidationError ? 'bg-rose-100' : 'bg-slate-100'
                }`}>
                  <Camera className={`w-7 h-7 ${photoValidationError ? 'text-rose-400' : 'text-slate-400'}`} />
                </div>
                {photoValidationError ? (
                  <p className="text-sm text-rose-600 font-semibold">{photoValidationError}</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-700">No evidence added yet</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Capture a photo on-site or upload an image to provide evidence of the problem.
                    </p>
                  </>
                )}
              </div>
            ) : (
              /* ── Photo + Video Grid — 1 col mobile / 2 col desktop ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Photo cards */}
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                  >
                    {/* ── Photo area ── */}
                    <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Evidence photo'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />

                      {/* Geotagged badge — top-right, camera captures only */}
                      {photo.isGeotagged && photo.source === 'camera' && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700/90 backdrop-blur-sm text-[11px] font-bold text-white shadow">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>✓ Geotagged</span>
                        </div>
                      )}

                      {/* Uploaded badge — top-left */}
                      {photo.source === 'upload' && (
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] font-bold text-slate-200 shadow">
                          <Upload className="w-3 h-3" />
                          <span>Uploaded</span>
                        </div>
                      )}

                      {/* Sample badge */}
                      {photo.source === 'sample' && (
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-600/80 backdrop-blur-sm text-[11px] font-bold text-white shadow">
                          <Info className="w-3 h-3" />
                          <span>Sample</span>
                        </div>
                      )}
                    </div>

                    {/* ── Location footer — shown once, only for geotagged camera captures ── */}
                    {photo.isGeotagged && photo.source === 'camera' && photo.geotagLocation ? (
                      <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100 flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[13px] font-semibold text-emerald-800 leading-snug break-words">
                            {photo.geotagLocation}
                          </p>
                          {photo.accuracy !== undefined && (
                            <p className="text-[10px] text-emerald-600 font-medium">
                              GPS ±{Math.round(photo.accuracy)}m · OSM Nominatim
                            </p>
                          )}
                        </div>
                      </div>
                    ) : photo.source === 'upload' ? (
                      /* Uploaded photos: do NOT show fake geotag — show "location not available" */
                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <p className="text-[12px] text-slate-500 font-medium">Location not available</p>
                      </div>
                    ) : null}

                    {/* ── Remove button ── */}
                    <div className="px-3 pb-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="w-full py-2 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:bg-rose-200 transition-colors text-xs font-bold border border-rose-100"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Video cards */}
                {otherFiles.filter(f => f.type === 'video').map((video) => (
                  <VideoEvidenceCard
                    key={video.id}
                    video={video}
                    isInteractive={!!videoPlayStates[video.id]}
                    onActivate={() =>
                      setVideoPlayStates((prev) => ({ ...prev, [video.id]: true }))
                    }
                    onRemove={() => {
                      setOtherFiles((prev) => prev.filter((item) => item.id !== video.id));
                      setVideoPlayStates((prev) => {
                        const next = { ...prev };
                        delete next[video.id];
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* ────────────────────────────────────────────────────────────── */}

          {/* Other Attached Files List */}
          {otherFiles.filter(f => f.type !== 'video').length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Documents ({otherFiles.filter(f => f.type !== 'video').length})
              </span>
              <div className="space-y-2">
                {otherFiles.filter(f => f.type !== 'video').map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-800">{f.name}</span>
                      <span className="text-slate-500 text-[10px]">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtherFiles((prev) => prev.filter((item) => item.id !== f.id))}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note (Section 13) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Protection:</strong> Exact personal metadata is safely protected. Public visitors see verified summaries and general village location, without exposing your private contact details.
            </p>
          </div>

          {/* Step 3 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPhotoValidationError(null);
                setStep(4);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: REVIEW & SUBMIT (SECTION 14) */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Complaint Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Please check your report details before submitting.
            </p>
          </div>

          <div className="space-y-4">
            {/* Section: Problem */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Problem
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{problemTitle}</h3>
              <p className="text-xs text-slate-600">{whatIsHappening}</p>
              <div className="pt-1">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Category: {selectedCategory}
                </span>
              </div>
            </div>

            {/* Section: Location — uses canonical location, never shows stale manual defaults */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Location
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {(() => {
                const loc = getCanonicalLocation();
                if (!loc) {
                  return (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>No location selected — please go back and set your location.</span>
                    </div>
                  );
                }
                if (loc.method === 'gps') {
                  return (
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1.5 text-sm text-slate-800 font-semibold">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{loc.displayAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          GPS verified · {loc.latitude}°N, {loc.longitude}°E
                          {loc.accuracy ? ` · ±${loc.accuracy}m accuracy` : ''}
                        </span>
                      </div>
                    </div>
                  );
                }
                // Manual
                return (
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-1.5 text-sm text-slate-800 font-semibold">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{loc.displayAddress}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Manual location</span>
                  </div>
                );
              })()}
            </div>

            {/* Section: People Affected & Community Impact */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/60 border border-amber-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>People Affected & Community Impact</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Directly Affected</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {(parseInt(affectedPeopleCount, 10) || 0).toLocaleString()} people
                  </div>
                  <span className="text-[11px] text-slate-500">in this community</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Community Impact</span>
                  <div className="mt-1">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-md border ${getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).badgeClass}`}>
                      {getCommunityImpactLevel(parseInt(affectedPeopleCount, 10) || 0).level} IMPACT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Severity prioritized</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Urgency & Pattern</span>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {urgency} Urgency
                  </div>
                  <span className="text-[11px] text-slate-500 block">{frequency}</span>
                </div>
              </div>
            </div>

            {/* Section: Evidence — shows ALL evidence: photos + videos + documents */}
            {(() => {
              const videoFiles = otherFiles.filter(f => f.type === 'video');
              const docFiles = otherFiles.filter(f => f.type === 'document');
              const totalCount = photos.length + videoFiles.length + docFiles.length;
              const countLabel = [
                photos.length > 0 ? `${photos.length} ${photos.length === 1 ? 'Photo' : 'Photos'}` : null,
                videoFiles.length > 0 ? `${videoFiles.length} ${videoFiles.length === 1 ? 'Video' : 'Videos'}` : null,
                docFiles.length > 0 ? `${docFiles.length} ${docFiles.length === 1 ? 'Document' : 'Documents'}` : null,
              ].filter(Boolean).join(' • ');

              return (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Evidence {totalCount > 0 ? `(${countLabel})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {totalCount === 0 ? (
                    <p className="text-xs text-rose-600 font-medium">No evidence attached. Please add at least one photo.</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Photos row */}
                      {photos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Photos ({photos.length})
                          </p>
                          <div className="flex items-start gap-3 overflow-x-auto pb-1">
                            {photos.map((p) => (
                              <div key={p.id} className="shrink-0 space-y-1">
                                <img
                                  src={p.url}
                                  alt="Evidence photo"
                                  className="w-24 h-24 rounded-xl object-cover border border-slate-200 shadow-sm"
                                />
                                {p.isGeotagged && p.geotagLocation && (
                                  <div className="w-24 flex items-start gap-1">
                                    <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <p className="text-[9px] text-emerald-700 font-medium leading-tight line-clamp-2">
                                      {p.geotagLocation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Videos row */}
                      {videoFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Videos ({videoFiles.length})
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {videoFiles.map((v) => (
                              <div
                                key={v.id}
                                className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black space-y-1 p-2"
                              >
                                <video
                                  src={v.url}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="w-full rounded-lg max-h-48 object-contain bg-black"
                                />
                                {v.name && (
                                  <div className="px-1 text-[11px] font-medium text-slate-300 truncate">
                                    {v.name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents list */}
                      {docFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Documents ({docFiles.length})
                          </p>
                          <div className="space-y-1">
                            {docFiles.map((d) => (
                              <div key={d.id} className="flex items-center gap-2 text-xs text-slate-700 bg-white rounded-lg px-3 py-2 border border-slate-200">
                                <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium truncate">{d.name}</span>
                                <span className="text-slate-400 text-[10px] shrink-0">({d.size})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Accuracy Confirmation Checkbox (Section 14) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <p className="text-xs text-amber-950 font-medium">
              Please confirm that the information you provided is accurate to the best of your knowledge.
            </p>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmAccuracy}
                onChange={(e) => setConfirmAccuracy(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-900">
                I confirm that this report is based on a real problem I observed in my community.
              </span>
            </label>
          </div>

          {/* Step 4 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitProblem}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Portal...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE CAMERA MODAL (WHEN USER CLICKS OPEN CAMERA) */}
      {/* ========================================================================= */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-4 p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Site Photo Capture</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative aspect-4/3 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCamera();
                      photoInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Select Photo from Gallery
                  </button>
                </div>
              )}
            </div>

            {/* ── Location Status Banner ────────────────────────────────────── */}
            {/* Shows real-time GPS/geocoding status. Appears exactly once. */}
            <div className="rounded-xl overflow-hidden text-xs">
              {photoGpsStatus === 'idle' && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Preparing location detection...</span>
                </div>
              )}

              {photoGpsStatus === 'locating' && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 text-amber-300">
                  <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>📍 Detecting your location...</span>
                </div>
              )}

              {photoGpsStatus === 'geocoding' && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 text-amber-300">
                  <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>📍 Getting location address...</span>
                </div>
              )}

              {photoGpsStatus === 'ready' && photoLocationData && (
                <div className="px-3 py-2.5 bg-emerald-900/60 border border-emerald-700/50">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-emerald-300 font-bold">
                        📍 {photoLocationData.formattedAddress}
                      </p>
                      <p className="text-emerald-500 text-[10px]">
                        GPS ±{Math.round(photoLocationData.accuracy)}m · {getAccuracyLabel(photoLocationData.accuracy)} accuracy · OSM Nominatim
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {photoGpsStatus === 'error' && (
                <div className="px-3 py-2.5 bg-rose-900/50 border border-rose-700/50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-rose-300">
                      {photoGpsError || 'Location unavailable. Photo will be captured without geotag.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* ────────────────────────────────────────────────────────────── */}

            {/* Shutter Button */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleCloseCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                title={
                  photoGpsStatus === 'ready'
                    ? `Capture geotagged photo — ${photoLocationData?.formattedAddress}`
                    : 'Capture photo (location still loading)'
                }
              >
                <div className="w-10 h-10 rounded-full border-2 border-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE VIDEO RECORD MODAL */}
      {/* ========================================================================= */}
      {isVideoRecordOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-4 p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Record Video Evidence</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative aspect-4/3 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-mono font-bold text-red-50">
                    {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCamera();
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = 'video/*';
                        fileInputRef.current.click();
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Select Video from Gallery
                  </button>
                </div>
              )}
            </div>

            {/* Record Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleCloseCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-slate-300"
              >
                Cancel
              </button>
              
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={!!cameraError}
                  className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                  title="Start Recording"
                >
                  <div className="w-5 h-5 rounded-full bg-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-14 h-14 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  title="Stop Recording"
                >
                  <div className="w-5 h-5 rounded-sm bg-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-end z-10">
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
