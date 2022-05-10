import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  // Servicio para llamar spinner y detener el spinner
  constructor(private spinnerService: NgxSpinnerService) { }

  public llamarSpinner() {
    this.spinnerService.show();
  }

  public detenerSpinner() {
   this.spinnerService.hide();
  }

}
