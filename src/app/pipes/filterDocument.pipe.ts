import { Pipe, PipeTransform } from "@angular/core";
import { Constant } from "../Constants/Constant";

@Pipe({
  name: "filterDocument",
})
export class FilterDocument implements PipeTransform {
  transform(value: any, args1: any): any {
    const resultadoBusqueda = [];
    for (const document of value) {
      if (
        document.cod_doc
          .toString()
          .toLowerCase()
          .indexOf(args1[0].toLowerCase()) > -1 &&
        document.nombre.toLowerCase().indexOf(args1[1].toLowerCase()) > -1
      ) {
        resultadoBusqueda.push(document);
      }
    }
    Constant.REPORT = resultadoBusqueda;
    return resultadoBusqueda;
  }
}
