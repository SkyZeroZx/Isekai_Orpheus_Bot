import { Pipe, PipeTransform } from "@angular/core";
import { Constant } from "../Constants/Constant";

@Pipe({
  name: "filterUsers",
})
export class FilterPipeUser implements PipeTransform {
  transform(value: any, args1: any): any {
    const resultadoBusqueda = [];
    for (const usuario of value) {
      if (
        usuario.id.toString().toLowerCase().indexOf(args1[0].toLowerCase()) >
          -1 &&
        usuario.estado.toLowerCase().indexOf(args1[1].toLowerCase()) > -1 &&
        usuario.username.toLowerCase().indexOf(args1[2].toLowerCase()) > -1 &&
        usuario.role.toLowerCase().indexOf(args1[3].toLowerCase()) > -1 &&
        usuario.nombre.toLowerCase().indexOf(args1[4].toLowerCase()) > -1 &&
        usuario.apellidoPaterno.toLowerCase().indexOf(args1[5].toLowerCase()) >
          -1 &&
        usuario.apellidoMaterno.toLowerCase().indexOf(args1[6].toLowerCase()) >
          -1
      ) {
  /*    if (args1[1] === "") {
          resultadoBusqueda.push(usuario);
        } else */
       
        if (usuario.estado === args1[1] || args1[1] === "") {
          resultadoBusqueda.push(usuario);
        }
      }
    }
    Constant.REPORT = resultadoBusqueda;
    return resultadoBusqueda;
  }
}
