/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent  implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement> | any;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string | any;
  usePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybird:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||
    this.platform.is('desktop')
  ) {
    this.usePicker = true;
  }
 }

  onPickImage(){
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker){
      this.filePickerRef.nativeElement.click();
      return;
    }
    const { Camera } = Plugins;
    Plugins['Camera']['getPhoto']({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    }).then((image:any) =>{
      this.selectedImage = image.base64Data;
      this.imagePick.emit(image.base64Data);

    }).catch((error:any) => {
      console.log(error);
      if(this.usePicker){
        this.filePickerRef.nativeElement.click();
      }
      return false;
    });

  }
  onFileChosen(event: Event){
       // const pickedFile = (event.target as HTMLInputElement).files[0];
   const fileInput = event.target as HTMLInputElement;

if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const pickedFile = fileInput.files[0];
    if(!pickedFile){
      return;
    } else {
      const fr = new FileReader();
      fr.onload = () =>{
        const dataUrL = fr.result?.toString();
        this.selectedImage = dataUrL;
        this.imagePick.emit(pickedFile);
      };
      fr.readAsDataURL(pickedFile);
    // Handle the case where files are not available
}
  }
}
}
