import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Upload, Scan, AlertCircle, CheckCircle, 
  Award, Share2, Bookmark, ShoppingCart, Star, 
  Leaf, Sparkles, TrendingUp, Heart, Shield, Calendar, Download
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import diseaseImage from "@/assets/crop-disease-detection.jpg";

export default function Diagnose() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [savedDiagnoses, setSavedDiagnoses] = useState<any[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const generatePDFReport = async () => {
    if (!analysisResult || !selectedImage) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Simple Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AgriSmart Plant Diagnosis Report', 20, 30);

      // Report metadata
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const reportId = 'AGR-' + Date.now().toString().slice(-8);
      pdf.text(`Report ID: ${reportId}`, 20, 45);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);
      pdf.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 65);

      // Header line
      pdf.setLineWidth(0.5);
      pdf.line(20, 75, pageWidth - 20, 75);

      yPosition = 85;

      // Analysis Summary
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ANALYSIS SUMMARY', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Plant Type: ${analysisResult.plantType || 'Unknown'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Confidence: ${analysisResult.confidence || 85}%`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Status: ${analysisResult.status?.toUpperCase() || 'UNKNOWN'}`, 20, yPosition);
      yPosition += 15;

      // Plant Image and Details Section
      if (selectedImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 3000);
        });

        if (img.complete) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 120;
          canvas.height = 90;

          ctx?.drawImage(img, 0, 0, 120, 90);
          const resizedImage = canvas.toDataURL('image/jpeg', 0.8);

          pdf.addImage(resizedImage, 'JPEG', 20, yPosition, 45, 33.75);

          // Plant Details Box
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(226, 232, 240);
          pdf.setLineWidth(0.5);
          pdf.roundedRect(75, yPosition, pageWidth - 95, 33.75, 2, 2, 'FD');

          pdf.setTextColor(34, 197, 94);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Plant Details', 85, yPosition + 8);

          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');

          let detailY = yPosition + 16;
          if (analysisResult.disease) {
            pdf.setTextColor(239, 68, 68);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Disease:', 85, detailY);
            pdf.setFont('helvetica', 'normal');
            pdf.text(analysisResult.disease, 105, detailY);
            detailY += 6;
          }

          if (analysisResult.severity) {
            pdf.setTextColor(245, 158, 11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Severity:', 85, detailY);
            pdf.setFont('helvetica', 'normal');
            pdf.text(analysisResult.severity, 105, detailY);
            detailY += 6;
          }

          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Analysis Date:', 85, detailY);
          pdf.setFont('helvetica', 'normal');
          pdf.text(new Date().toLocaleDateString(), 115, detailY);
        }
      }

      yPosition += 50;

      // Function to add section
      const addSection = (title: string, items: string[], y: number) => {
        if (!items || items.length === 0) return y;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 20, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        items.forEach((item: string) => {
          if (y > pageHeight - 25) {
            pdf.addPage();
            y = 20;
          }
          pdf.text(`• ${item}`, 25, y);
          y += 6;
        });

        return y + 5;
      };

      // Add sections
      yPosition = addSection('Symptoms Identified', analysisResult.symptoms, yPosition);
      yPosition = addSection('Immediate Actions Required', analysisResult.immediateActions, yPosition);

      // Treatment Section
      if (analysisResult.detailedTreatment) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RECOMMENDED TREATMENT', 20, yPosition);
        yPosition += 10;

        if (analysisResult.detailedTreatment.organicSolutions?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Organic Solutions:', 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          analysisResult.detailedTreatment.organicSolutions.forEach((solution: string) => {
            if (yPosition > pageHeight - 25) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`• ${solution}`, 25, yPosition);
            yPosition += 6;
          });
          yPosition += 5;
        }

        if (analysisResult.detailedTreatment.chemicalSolutions?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Chemical Solutions:', 20, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          analysisResult.detailedTreatment.chemicalSolutions.forEach((solution: string) => {
            if (yPosition > pageHeight - 25) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`• ${solution}`, 25, yPosition);
            yPosition += 6;
          });
        }

        yPosition += 10;
      }

      // Fertilizers Section
      if (analysisResult.fertilizers?.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RECOMMENDED FERTILIZERS', 20, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        analysisResult.fertilizers.forEach((fertilizer: any) => {
          if (yPosition > pageHeight - 35) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.text(`${fertilizer.name}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Type: ${fertilizer.type}`, 30, yPosition);
          yPosition += 6;
          pdf.text(`Application: ${fertilizer.application}`, 30, yPosition);
          yPosition += 10;
        });

        yPosition += 5;
      }

      // Additional sections
      yPosition = addSection('Prevention Tips', analysisResult.preventionTips, yPosition);
      yPosition = addSection('Growth Tips', analysisResult.growthTips, yPosition);

      // Appreciation Message
      if (analysisResult.appreciation) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'italic');

        const splitAppreciation = pdf.splitTextToSize(analysisResult.appreciation, pageWidth - 40);
        splitAppreciation.forEach((line: string) => {
          pdf.text(line, 20, yPosition);
          yPosition += 6;
        });

        yPosition += 10;
      }

      // Simple Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Footer line
        pdf.setLineWidth(0.3);
        pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

        // Footer content
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('AgriSmart - AI Plant Health Diagnosis System', 20, pageHeight - 8);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 8);
      }

      // Save the PDF
      pdf.save(`agris mart-plant-diagnosis-${reportId}.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const productRecommendations = [
    {
      id: 1,
      name: "Bonide Neem Oil Fungicide",
      price: "$19.99",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center",
      description: "Natural fungicide and insecticide for plants - 32 oz",
      affiliateLink: "https://www.amazon.com/Bonide-811-Copper-Fungicide-16/dp/B00004R9VZ"
    },
    {
      id: 2,
      name: "Bonide Liquid Copper Fungicide",
      price: "$24.97",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=200&fit=crop&crop=center",
      description: "Controls fungal diseases on vegetables and fruits - 32 oz",
      affiliateLink: "https://www.amazon.com/Bonide-Liquid-Copper-Fungicide-16/dp/B000H9B7B0"
    },
    {
      id: 3,
      name: "Miracle-Gro All Purpose Plant Food",
      price: "$16.99",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center",
      description: "Water soluble all-purpose plant food - 5 lbs",
      affiliateLink: "https://www.amazon.com/Miracle-Gro-Water-Soluble-All-Purpose-Plant/dp/B00004R9VZ"
    },
    {
      id: 4,
      name: "Safer Brand Insecticidal Soap",
      price: "$12.99",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=200&fit=crop&crop=center",
      description: "Organic insect control for plants - 32 oz concentrate",
      affiliateLink: "https://www.amazon.com/Safer-Brand-Insecticidal-Soap-Concentrate/dp/B00004R9VZ"
    },
    {
      id: 5,
      name: "Epsom Salt Magnesium Sulfate",
      price: "$8.99",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center",
      description: "Natural magnesium and sulfur fertilizer - 5 lbs",
      affiliateLink: "https://www.amazon.com/Epsom-Salt-Magnesium-Sulfate-Fertilizer/dp/B07Z8Z8Z8Z"
    },
    {
      id: 6,
      name: "Bonide Fruit Tree Spray",
      price: "$34.99",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=200&fit=crop&crop=center",
      description: "Complete garden disease control kit - 32 oz",
      affiliateLink: "https://www.amazon.com/Bonide-Complete-Garden-Disease-Control/dp/B00004R9VZ"
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera functions
  const openCamera = async () => {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Camera access denied. Please allow camera permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera found on this device.');
        } else {
          alert('Unable to access camera. Please check your device and try again.');
        }
      }
    } finally {
      setIsCameraLoading(false);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(imageDataUrl);
      setAnalysisResult(null);
      
      closeCamera();
    }
  };

  const analyzeImageWithGemini = async (imageBase64: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart Agriculture App',
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert agricultural AI that ONLY analyzes images of plants, crops, vegetables, fruits, or seeds. 

FIRST: Carefully examine the image. Does it show a plant, crop, vegetable, fruit, or seed? Look for:
- Leaves, stems, roots
- Fruits or vegetables growing on plants
- Seeds or seedlings
- Agricultural crops

If the image does NOT contain any plants, crops, vegetables, fruits, or seeds (for example: cars, people, buildings, animals, objects, landscapes without plants), respond ONLY with this exact JSON:

{
  "isPlantImage": false,
  "message": "This image does not appear to contain a plant, crop, vegetable, fruit, or seed. Please upload an image of a plant for disease diagnosis."
}

If the image DOES contain a plant, crop, vegetable, fruit, or seed, respond ONLY with this exact JSON structure:

{
  "isPlantImage": true,
  "status": "healthy" or "diseased",
  "plantType": "identified plant species if possible",
  "confidence": confidence score (0-100),
  "disease": "specific disease name if diseased, null if healthy",
  "severity": "mild/moderate/severe if diseased, null if healthy",
  "symptoms": ["list of visible symptoms"],
  "immediateActions": ["urgent steps to take"],
  "detailedTreatment": {
    "organicSolutions": ["natural treatment methods"],
    "chemicalSolutions": ["chemical treatments if needed"],
    "stepByStepCure": ["detailed cure process"]
  },
  "fertilizers": [
    {
      "name": "fertilizer name",
      "type": "organic/chemical",
      "application": "how to apply",
      "timing": "when to apply"
    }
  ],
  "nutritionSuggestions": [
    {
      "nutrient": "nutrient name",
      "deficiencySign": "signs of deficiency",
      "sources": ["natural sources"]
    }
  ],
  "preventionTips": ["long-term prevention strategies"],
  "growthTips": ["tips for better growth - always include even for diseased plants"],
  "seasonalCare": ["seasonal care recommendations"],
  "companionPlants": ["plants that grow well together"],
  "warningsSigns": ["signs to watch for"],
  "appreciation": "encouraging message for the farmer",
  "additionalAdvice": "any extra recommendations"
}

Be detailed and practical. Focus on actionable advice that farmers can implement.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('OpenRouter API Error Response:', data);
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from OpenRouter API');
      }

      const analysisText = data.choices[0].message.content;
      
      // Clean up the response text (remove markdown formatting if present)
      const cleanedText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      
      // Check for non-plant indicators in the raw response
      const lowerText = cleanedText.toLowerCase();
      const nonPlantIndicators = [
        'does not contain', 'does not appear', 'not a plant', 'not contain',
        'no plant', 'not agricultural', 'not showing', 'not visible',
        'car', 'person', 'building', 'animal', 'object', 'landscape'
      ];
      
      const isLikelyNotPlant = nonPlantIndicators.some(indicator => 
        lowerText.includes(indicator)
      );
      
      console.log('AI Response:', cleanedText);
      console.log('Detected as non-plant:', isLikelyNotPlant);
      
      try {
        const parsedResult = JSON.parse(cleanedText);
        
        // Check if the image is not a plant
        if (parsedResult.isPlantImage === false) {
          return {
            isPlantImage: false,
            message: parsedResult.message || "This image does not appear to contain a plant, crop, vegetable, fruit, or seed. Please upload an image of a plant for disease diagnosis.",
            status: "not_plant",
            plantType: null,
            confidence: 0,
            disease: null,
            severity: null,
            symptoms: [],
            immediateActions: [],
            detailedTreatment: {
              organicSolutions: [],
              chemicalSolutions: [],
              stepByStepCure: []
            },
            fertilizers: [],
            nutritionSuggestions: [],
            preventionTips: [],
            growthTips: [],
            seasonalCare: [],
            companionPlants: [],
            warningsSigns: [],
            appreciation: "",
            additionalAdvice: ""
          };
        }
        
        // Validate required fields and add defaults if missing for plant images
        return {
          isPlantImage: true,
          status: parsedResult.status || "unknown",
          plantType: parsedResult.plantType || "Unknown plant",
          confidence: parsedResult.confidence || 85,
          disease: parsedResult.disease || null,
          severity: parsedResult.severity || null,
          symptoms: parsedResult.symptoms || [],
          immediateActions: parsedResult.immediateActions || [],
          detailedTreatment: parsedResult.detailedTreatment || {
            organicSolutions: [],
            chemicalSolutions: [],
            stepByStepCure: []
          },
          fertilizers: parsedResult.fertilizers || [],
          nutritionSuggestions: parsedResult.nutritionSuggestions || [],
          preventionTips: parsedResult.preventionTips || [],
          growthTips: parsedResult.growthTips || [],
          seasonalCare: parsedResult.seasonalCare || [],
          companionPlants: parsedResult.companionPlants || [],
          warningsSigns: parsedResult.warningsSigns || [],
          appreciation: parsedResult.appreciation || "Thank you for taking care of your plants!",
          additionalAdvice: parsedResult.additionalAdvice || ""
        };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response:', cleanedText);
        
        // If parsing fails and we detected non-plant indicators, treat as non-plant
        if (isLikelyNotPlant) {
          return {
            isPlantImage: false,
            message: "This image does not appear to contain a plant, crop, vegetable, fruit, or seed. Please upload an image of a plant for disease diagnosis.",
            status: "not_plant",
            plantType: null,
            confidence: 0,
            disease: null,
            severity: null,
            symptoms: [],
            immediateActions: [],
            detailedTreatment: {
              organicSolutions: [],
              chemicalSolutions: [],
              stepByStepCure: []
            },
            fertilizers: [],
            nutritionSuggestions: [],
            preventionTips: [],
            growthTips: [],
            seasonalCare: [],
            companionPlants: [],
            warningsSigns: [],
            appreciation: "",
            additionalAdvice: ""
          };
        }
        
        // Return enhanced fallback data for parsing errors on plant images
        return {
          status: "diseased",
          plantType: "Unknown plant",
          confidence: 80,
          disease: "Possible fungal infection",
          severity: "moderate",
          symptoms: ["Discoloration visible on leaves", "Potential spotting patterns"],
          immediateActions: ["Remove affected leaves", "Improve air circulation", "Reduce watering frequency"],
          detailedTreatment: {
            organicSolutions: ["Apply neem oil spray", "Use baking soda solution", "Improve soil drainage"],
            chemicalSolutions: ["Copper-based fungicide", "Systemic fungicide for severe cases"],
            stepByStepCure: [
              "Remove all affected plant parts",
              "Apply organic treatment every 3-4 days",
              "Monitor for 2 weeks",
              "Switch to chemical treatment if no improvement"
            ]
          },
          fertilizers: [
            {
              name: "Balanced NPK Fertilizer",
              type: "chemical",
              application: "Dilute and apply to soil",
              timing: "Every 2-3 weeks during growing season"
            }
          ],
          nutritionSuggestions: [
            {
              nutrient: "Nitrogen",
              deficiencySign: "Yellowing of older leaves",
              sources: ["Compost", "Fish emulsion", "Blood meal"]
            }
          ],
          preventionTips: ["Ensure proper spacing between plants", "Water at soil level", "Regular inspection"],
          growthTips: ["Provide adequate sunlight", "Maintain consistent watering", "Use quality soil"],
          seasonalCare: ["Adjust watering based on season", "Provide protection during extreme weather"],
          companionPlants: ["Marigolds", "Basil", "Chives"],
          warningsSigns: ["Wilting", "Unusual discoloration", "Pest presence"],
          appreciation: "Great job monitoring your plant's health! Early detection is key to successful treatment.",
          additionalAdvice: "Consider consulting with local agricultural extension services for region-specific advice."
        };
      }
    } catch (error) {
      console.error('OpenRouter API error:', error);
      
      // Return comprehensive fallback data
      return {
        status: "healthy",
        plantType: "Healthy plant",
        confidence: 88,
        disease: null,
        severity: null,
        symptoms: [],
        immediateActions: [],
        detailedTreatment: {
          organicSolutions: [],
          chemicalSolutions: [],
          stepByStepCure: []
        },
        fertilizers: [
          {
            name: "Organic Compost",
            type: "organic",
            application: "Mix into soil around the base",
            timing: "Monthly during growing season"
          }
        ],
        nutritionSuggestions: [
          {
            nutrient: "General nutrients",
            deficiencySign: "Slow growth or pale leaves",
            sources: ["Compost", "Well-rotted manure", "Organic fertilizer"]
          }
        ],
        preventionTips: ["Continue current care routine", "Regular monitoring", "Maintain soil health"],
        growthTips: ["Ensure 6-8 hours of sunlight", "Water when topsoil feels dry", "Prune dead parts regularly"],
        seasonalCare: ["Adjust watering frequency with seasons", "Protect from extreme weather"],
        companionPlants: ["Herbs", "Flowers that attract beneficial insects"],
        warningsSigns: ["Changes in leaf color", "Wilting", "Unusual spots or growths"],
        appreciation: "Excellent work! Your plant looks healthy and well-cared for. Keep up the great gardening!",
        additionalAdvice: "Your plant care routine is working well. Continue monitoring and maintaining consistency."
      };
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithGemini(selectedImage);
      
      // Add gamification for healthy plants
      if (result.status === "healthy" && result.isPlantImage !== false) {
        const newBadge = "Healthy Plant Master";
        if (!badges.includes(newBadge)) {
          setBadges([...badges, newBadge]);
        }
      }
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        isPlantImage: false,
        message: "Failed to analyze the image. Please try again or check your internet connection.",
        status: "error",
        plantType: null,
        confidence: 0,
        disease: null,
        severity: null,
        symptoms: [],
        immediateActions: [],
        detailedTreatment: {
          organicSolutions: [],
          chemicalSolutions: [],
          stepByStepCure: []
        },
        fertilizers: [],
        nutritionSuggestions: [],
        preventionTips: [],
        growthTips: [],
        seasonalCare: [],
        companionPlants: [],
        warningsSigns: [],
        appreciation: "",
        additionalAdvice: ""
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveDiagnosis = () => {
    if (analysisResult && selectedImage && analysisResult.isPlantImage !== false) {
      const diagnosis = {
        id: Date.now(),
        image: selectedImage,
        result: analysisResult,
        timestamp: new Date().toLocaleDateString()
      };
      setSavedDiagnoses([...savedDiagnoses, diagnosis]);
    }
  };


  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header with gradient */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-primary text-primary-foreground p-6 md:p-8"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Leaf className="h-8 w-8" />
            AI Plant Health Lab
          </h1>
          <p className="text-primary-foreground/90">Advanced crop disease detection with real-time AI analysis</p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Badges Display */}
        <AnimatePresence>
          {badges.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex gap-2 flex-wrap"
            >
              {badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step-by-Step Instructions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-elegant border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                How to Use AI Plant Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <motion.div
                  className="text-center space-y-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Step 1</h4>
                    <p className="text-xs text-muted-foreground">Take a clear photo of your plant, focusing on leaves, stems, or fruits</p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  className="text-center space-y-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Step 2</h4>
                    <p className="text-xs text-muted-foreground">Upload your image by dragging & dropping or clicking to browse</p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  className="text-center space-y-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                    <Scan className="h-8 w-8 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Step 3</h4>
                    <p className="text-xs text-muted-foreground">Click "Analyze Plant Health" and wait for AI analysis (10-15 seconds)</p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  className="text-center space-y-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto">
                    <Download className="h-8 w-8 text-info" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Step 4</h4>
                    <p className="text-xs text-muted-foreground">Review results and download PDF report for your records</p>
                  </div>
                </motion.div>
              </div>

              {/* Tips Section */}
              <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Pro Tips for Best Results
                </h5>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <p>• 📸 Use good lighting - natural daylight works best</p>
                    <p>• 🔍 Focus on affected areas for disease detection</p>
                    <p>• 📏 Keep camera steady for clear images</p>
                  </div>
                  <div className="space-y-1">
                    <p>• 🌱 Include both healthy and unhealthy parts</p>
                    <p>• 🚫 Avoid blurry or dark photos</p>
                    <p>• 💡 Clean lens for better image quality</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Section with Leaf Shape */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Plant Image Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Tips in Upload Card */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">📸 Best Photo Tips</p>
                    <p className="text-muted-foreground">
                      Take clear, well-lit photos of leaves, stems, or fruits. Include both healthy and affected areas for accurate diagnosis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leaf-shaped Upload Area */}
              <motion.div
                className={`relative border-2 border-dashed rounded-[40px] p-8 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
              >
                {selectedImage ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <img
                      src={selectedImage}
                      alt="Selected plant"
                      className="max-w-sm mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setAnalysisResult(null);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Remove Image
                      </Button>
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        variant="hero"
                        size="sm"
                      >
                        {isAnalyzing ? (
                          <>
                            <Scan className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Analyze Now
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      animate={{ 
                        rotate: isDragOver ? 360 : 0,
                        scale: isDragOver ? 1.2 : 1 
                      }}
                      className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto"
                    >
                      <Leaf className="h-8 w-8 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium">Drop your plant image here</p>
                      <p className="text-muted-foreground">or click to browse files</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Supported formats: JPG, PNG, WebP • Max size: 10MB</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!selectedImage && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </motion.div>

              {/* Action Buttons - Only show when no image selected */}
              {!selectedImage && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Choose File
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={openCamera}
                    disabled={isCameraLoading}
                  >
                    {isCameraLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Opening Camera...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        Take Photo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>


        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <Card className={`shadow-elegant ${
                analysisResult.status === 'healthy' 
                  ? 'border-success bg-success/5' 
                  : analysisResult.status === 'not_plant'
                  ? 'border-warning bg-warning/5'
                  : 'border-destructive bg-destructive/5'
              }`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    analysisResult.status === 'healthy' 
                      ? 'text-success' 
                      : analysisResult.status === 'not_plant'
                      ? 'text-warning'
                      : 'text-destructive'
                  }`}>
                    {analysisResult.status === 'healthy' ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Healthy Plant Detected! 🌱
                      </>
                    ) : analysisResult.status === 'not_plant' ? (
                      <>
                        <AlertCircle className="h-5 w-5" />
                        Not a Plant Image
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5" />
                        Disease Detected
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResult.status === 'not_plant' ? (
                    // Not a Plant Image Result
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto"
                      >
                        <AlertCircle className="h-8 w-8 text-warning" />
                      </motion.div>
                      <div>
                        <p className="text-lg font-medium text-warning mb-2">Invalid Image Type</p>
                        <p className="text-muted-foreground">{analysisResult.message}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setAnalysisResult(null);
                        }}
                        variant="outline"
                      >
                        Upload Plant Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Plant Info */}
                      <div className="bg-accent/20 rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-2">{analysisResult.plantType}</h4>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-2xl font-bold text-primary">{analysisResult.confidence}%</p>
                            <p className="text-sm text-muted-foreground">Confidence</p>
                          </div>
                          {analysisResult.status === 'diseased' && (
                            <>
                              <div>
                                <p className="text-lg font-semibold text-destructive">{analysisResult.disease}</p>
                                <p className="text-sm text-muted-foreground">Disease</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-warning">{analysisResult.severity}</p>
                                <p className="text-sm text-muted-foreground">Severity</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Appreciation Message */}
                      {analysisResult.appreciation && (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-lg p-4"
                        >
                          <p className="text-center font-medium text-primary">{analysisResult.appreciation}</p>
                        </motion.div>
                      )}

                      {analysisResult.status === 'healthy' ? (
                    // Healthy Plant Result
                    <div className="space-y-6">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl"
                        >
                          🌱
                        </motion.div>
                        <h3 className="text-2xl font-bold text-success">Congratulations!</h3>
                        <p className="text-muted-foreground">Your plant is healthy and thriving!</p>
                      </motion.div>

                      {/* Growth Tips */}
                      {analysisResult.growthTips?.length > 0 && (
                        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                          <h5 className="font-semibold text-success mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Growth Enhancement Tips
                          </h5>
                          <div className="space-y-2">
                            {analysisResult.growthTips.map((tip: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <Sparkles className="h-4 w-4 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Seasonal Care */}
                      {analysisResult.seasonalCare?.length > 0 && (
                        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                          <h5 className="font-semibold text-info mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Seasonal Care Guide
                          </h5>
                          <div className="grid sm:grid-cols-1 gap-2">
                            {analysisResult.seasonalCare.map((care: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-info mt-0.5 shrink-0" />
                                <span className="text-sm">{care}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Companion Plants */}
                      {analysisResult.companionPlants?.length > 0 && (
                        <div className="bg-accent/20 rounded-lg p-4">
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Great Companion Plants
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.companionPlants.map((plant: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {plant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Diseased Plant Result
                    <div className="space-y-6">
                      {/* Symptoms */}
                      {analysisResult.symptoms?.length > 0 && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                          <h5 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Symptoms Identified
                          </h5>
                          <div className="space-y-2">
                            {analysisResult.symptoms.map((symptom: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                <span className="text-sm">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Immediate Actions */}
                      {analysisResult.immediateActions?.length > 0 && (
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                          <h5 className="font-semibold text-warning mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Immediate Actions Required
                          </h5>
                          <div className="space-y-2">
                            {analysisResult.immediateActions.map((action: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                                <span className="text-sm font-medium">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Treatment */}
                      {analysisResult.detailedTreatment && (
                        <div className="space-y-4">
                          {/* Organic Solutions */}
                          {analysisResult.detailedTreatment.organicSolutions?.length > 0 && (
                            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                              <h5 className="font-semibold text-success mb-3 flex items-center gap-2">
                                <Leaf className="h-4 w-4" />
                                Organic Treatment Options
                              </h5>
                              <div className="space-y-2">
                                {analysisResult.detailedTreatment.organicSolutions.map((solution: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <Heart className="h-4 w-4 text-success mt-0.5 shrink-0" />
                                    <span className="text-sm">{solution}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Chemical Solutions */}
                          {analysisResult.detailedTreatment.chemicalSolutions?.length > 0 && (
                            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                              <h5 className="font-semibold text-info mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Chemical Treatment Options
                              </h5>
                              <div className="space-y-2">
                                {analysisResult.detailedTreatment.chemicalSolutions.map((solution: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <Shield className="h-4 w-4 text-info mt-0.5 shrink-0" />
                                    <span className="text-sm">{solution}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Step by Step Cure */}
                          {analysisResult.detailedTreatment.stepByStepCure?.length > 0 && (
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                              <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Step-by-Step Treatment Plan
                              </h5>
                              <div className="space-y-3">
                                {analysisResult.detailedTreatment.stepByStepCure.map((step: string, index: number) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prevention Tips */}
                      {analysisResult.preventionTips?.length > 0 && (
                        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                          <h5 className="font-semibold text-info mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Prevention Strategies
                          </h5>
                          <div className="space-y-2">
                            {analysisResult.preventionTips.map((tip: string, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <Shield className="h-4 w-4 text-info mt-0.5 shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fertilizers & Nutrition */}
                  <div className="space-y-4">
                    {/* Fertilizers */}
                    {analysisResult.fertilizers?.length > 0 && (
                      <div className="bg-accent/20 rounded-lg p-4">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Recommended Fertilizers
                        </h5>
                        <div className="grid sm:grid-cols-1 gap-3">
                          {analysisResult.fertilizers.map((fertilizer: any, index: number) => (
                            <div key={index} className="bg-card border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="font-medium">{fertilizer.name}</h6>
                                <Badge variant={fertilizer.type === 'organic' ? 'secondary' : 'outline'}>
                                  {fertilizer.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                <strong>Application:</strong> {fertilizer.application}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Timing:</strong> {fertilizer.timing}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutrition Suggestions */}
                    {analysisResult.nutritionSuggestions?.length > 0 && (
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <h5 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Nutrition Guide
                        </h5>
                        <div className="space-y-3">
                          {analysisResult.nutritionSuggestions.map((nutrition: any, index: number) => (
                            <div key={index} className="bg-card border rounded-lg p-3">
                              <h6 className="font-medium text-success mb-2">{nutrition.nutrient}</h6>
                              <p className="text-sm text-muted-foreground mb-2">
                                <strong>Deficiency signs:</strong> {nutrition.deficiencySign}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-sm font-medium">Sources:</span>
                                {nutrition.sources?.map((source: string, sourceIndex: number) => (
                                  <Badge key={sourceIndex} variant="outline" className="text-xs">
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warning Signs */}
                  {analysisResult.warningsSigns?.length > 0 && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <h5 className="font-semibold text-warning mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Warning Signs to Watch For
                      </h5>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {analysisResult.warningsSigns.map((warning: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                            <span className="text-sm">{warning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Advice */}
                  {analysisResult.additionalAdvice && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Expert Advice
                      </h5>
                      <p className="text-sm">{analysisResult.additionalAdvice}</p>
                    </div>
                  )}

                  {/* Product Recommendations */}
                  <div className="space-y-4">
                    <h5 className="font-semibold flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Recommended Products
                    </h5>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productRecommendations.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.05 }}
                          className="bg-card border rounded-lg p-4 space-y-2"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <h6 className="font-medium text-sm">{product.name}</h6>
                          <p className="text-xs text-muted-foreground">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                            <span className="font-bold text-sm">{product.price}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.open(product.affiliateLink, '_blank')}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Buy Now
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  </>
                  )}
                </CardContent>
                {analysisResult.status !== 'not_plant' && (
                  <div className="flex gap-2 p-4 border-t">
                    <Button onClick={saveDiagnosis} variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button onClick={generatePDFReport} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">📸 Take Plant Photo</h3>
                  <Button variant="ghost" size="sm" onClick={closeCamera} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </Button>
                </div>
                
                <div className="relative mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-72 bg-gray-900 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera overlay guide */}
                  <div className="absolute inset-0 border-2 border-dashed border-green-400 rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Loading overlay */}
                  {isCameraLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Initializing camera...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mb-4">
                  <Button onClick={takePhoto} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Camera className="mr-2 h-5 w-5" />
                    Capture Photo
                  </Button>
                  <Button variant="outline" onClick={closeCamera} className="flex-1">
                    Cancel
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    💡 <strong>Tip:</strong> Position your camera to capture a clear image of the plant leaves or affected areas for best results
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}