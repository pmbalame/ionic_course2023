import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild("filePicker") filePickerRef: ElementRef<HTMLInputElement> | any;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string | any;
  usePicker = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    if ((this.platform.is("mobile") && !this.platform.is("hybrid")) || this.platform.is("desktop")) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (this.usePicker) { this.filePickerRef.nativeElement.click(); return; }
    Camera.getPhoto({ quality: 50, source: CameraSource.Prompt, correctOrientation: true, height: 320, width: 200, resultType: CameraResultType.Base64 })
    .then((image: any) => { this.selectedImage = image.base64String; this.imagePick.emit(image.base64String); })
    .catch((error: any) => { console.log(error); if (this.usePicker) { this.filePickerRef.nativeElement.click(); } });
  }

  onFileChosen(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const pickedFile = fileInput.files[0];
      if (!pickedFile) { return; }
      const fr = new FileReader();
      fr.onload = () => { this.selectedImage = fr.result?.toString(); this.imagePick.emit(pickedFile); };
      fr.readAsDataURL(pickedFile);
    }
  }
}
