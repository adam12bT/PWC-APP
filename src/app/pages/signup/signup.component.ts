import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [ ReactiveFormsModule,RouterModule,CommonModule],
  standalone:true
 
})
export class SignupComponent {
  authService  =  inject(AuthService);
router  =  inject(Router);
image: File | null = null;

onFileSelected(event: any): void {
  const file = event?.target?.files?.[0];
  if (file) {
    this.image = file;
    this.convertFileToBase64(file).then(base64String => {
      // Update form control with base64 string
      this.signUpForm.controls.image.setValue(base64String);
    }).catch(error => {
      console.error('Error converting file to base64:', error);
      // Handle error display or logging
    });
  } else {
    console.error('No file selected');
  }
}

public signUpForm = new FormGroup({
 
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required]),
  lastname: new FormControl('', [Validators.required]),
  tel: new FormControl('', [Validators.required]),
 informations: new FormControl('', [Validators.required]),
  role: new FormControl('USER'),
  
  image:new FormControl('',[Validators.required]),
  firstname: new FormControl('', [Validators.required])
})

onSubmit() {
  
  console.log("aaaaaaaaaaa")
  console.log(this.signUpForm)

  if (this.signUpForm.valid) {
    console.log(this.signUpForm.value);
    this.authService.register(this.signUpForm.value)
      .subscribe({
        next: (data: any) => {
         
          console.log(data);
          this.router.navigate(['/login']);
        },
        error: (err) => console.log(err)
      });
  }
}



async convertFileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Extract base64 content from Data URL
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Read the image file as Data URL (which includes Base64 encoding)
    reader.readAsDataURL(file);
  });
}

}
 
