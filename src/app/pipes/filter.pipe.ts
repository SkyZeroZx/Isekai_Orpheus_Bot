import { Pipe, PipeTransform } from '@angular/core';
import { Constant } from '../nucleo/constante/Constant';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(value: any, args1: any): any {
 
        const resultadoBusqueda = [];
        for (const usuario of value) {
            if ( (usuario.APELLIDOS.toLowerCase().indexOf(args1[0].toLowerCase()) > -1)
            && (usuario.ESTADO.toLowerCase().indexOf(args1[1].toLowerCase()) > -1)
            && (usuario.ESTUDIANTE.toLowerCase().indexOf(args1[2].toLowerCase()) > -1)
            && (usuario.ID_EST_DOC.toLowerCase().indexOf(args1[3].toLowerCase()) > -1)
            && (usuario.COD_EST.toLowerCase().indexOf(args1[4].toLowerCase()) > -1)
            )   {
                 if (args1[1] === '') {
                    resultadoBusqueda.push(usuario);
                 } else if (usuario.ESTADO === args1[1]) {
                    resultadoBusqueda.push(usuario);
                 }

            }
        }
        Constant.LISTA_USUARIOS_FILTRADO = resultadoBusqueda;
        return resultadoBusqueda;
    }

}
