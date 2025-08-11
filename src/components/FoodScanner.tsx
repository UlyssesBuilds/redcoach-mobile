import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, Loader2 } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';

interface FoodScannerProps {
  onClose: () => void;
  onFoodLogged: (food: any) => void;
}

export const FoodScanner = ({ onClose, onFoodLogged }: FoodScannerProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Automatically start camera when component mounts
  useEffect(() => {
    takePhoto();
  }, []);

  const takePhoto = async () => {
    try {
      setIsScanning(true);
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        setCapturedImage(image.dataUrl);
        // Simulate AI food recognition
        setTimeout(() => {
          const mockFood = {
            id: Date.now(),
            name: 'Chicken Breast',
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6,
            serving: '100g'
          };
          
          onFoodLogged(mockFood);
          toast({
            title: "Food logged!",
            description: `Added ${mockFood.name} to your diary`,
          });
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        variant: "destructive",
        title: "Camera error",
        description: "Unable to access camera. Please try again.",
      });
      onClose(); // Close modal on camera error
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card border-coach-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Food Scanner</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!capturedImage ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-coach-red/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-coach-red" />
              </div>
              <div>
                <h3 className="font-semibold">Opening Camera...</h3>
                <p className="text-sm text-muted-foreground">
                  {isScanning ? 'Accessing camera to scan your food' : 'Camera ready to scan'}
                </p>
              </div>
              {isScanning && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-coach-red" />
                  <span className="text-sm">Opening camera...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <img 
                src={capturedImage} 
                alt="Captured food" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-coach-red" />
                <span className="text-sm">Analyzing food...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};