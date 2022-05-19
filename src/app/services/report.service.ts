import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Constant } from "../Constants/Constant";
const EXCEL_TYPE =
  "application/vnd.openxmlformats- officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Injectable({
  providedIn: "root",
})
export class ReporteService {
  constructor() {}
  public exportAsExcelFile(excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Constant.REPORT);
    const workbook: XLSX.WorkBook = {
      Sheets: { homologacion: worksheet },
      SheetNames: ["homologacion"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  public exportAsPDF(nombre,encabezado) {
    // TODO Add Filters in report
    let header = new Array<any>();
    header[0] = encabezado;
    //Object.keys(Constant.REPORT[0]);
    let arrReport = Constant.REPORT.map((obj) => Object.values(obj));
    var pdf = new jsPDF({
      orientation: "landscape",
    });
    pdf.setFont("helvetica");
    pdf.text(nombre, 12, 6);
    pdf.setTextColor(99);
    pdf.setFontSize(6);
    (pdf as any).autoTable({
      styles: { fontSize: 7 },
      head: header,
      body: arrReport,
      theme: "grid",
      didDrawCell: (data) => {},
    });
    pdf.output("dataurlnewwindow");
    pdf.save(nombre + ".pdf");
  }
}
