import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // Import FormsModule y NgForm para manejar el formulario
import { User } from '../../models/user.model'; // Importar el modelo User desde la subcarpeta services
import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.model';
import { UserService } from '../../services/user.service'; // Importar el servicio UserService desde la subcarpeta services
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { MaskEmailPipe } from '../../pipes/maskEmail.pipe';
import { pageInterface } from '../../models/paginacion.model';
import { Vinos } from '../../models/vinos.model';
import { ValoracionService } from '../../services/valoracion.service';
import { valoracionesInterface } from '../../models/valoraciones.model';

@Component({
  selector: 'app-valoraciones',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, MaskEmailPipe],
  templateUrl: './valoraciones.component.html',
  styleUrl: './valoraciones.component.css'
})
export class ValoracionesComponent {
  valoraciones: valoracionesInterface[] = [];
  vinos: Vinos[] = [];
  experiencias: Experiencia[] = []; // Lista de experiencias
  usuarios: User[] = []; // Lista de usuarios con tipado User
  formularioVisible: boolean = false;
  resuelto: boolean = false;
  usuarioEdicion: User | null = null; // Usuario en proceso de edición
  indiceEdicion: number | null = null; // Almacena el índice del usuario en edición
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  nuevoUsuario: User = {
    name: '',
    mail: '', // Añadir el campo email
    password: '',
    comment: '',
    habilitado: true
  };
  newExperience: Experiencia = {
    titulo: '',
    owner: '',
    participants: [],
    description: ''
  };
  nuevaValoracion: valoracionesInterface = {
    owner: this.nuevoUsuario,
    experiencia: this.newExperience,
    vino: this.vinos,
    likes: 0,
    dislikes: 0,
    comments: [],
  };

  constructor(private valoracionService: ValoracionService) {}

  ngOnInit(): void {
    // Cargar valoraciones desde el valoracion service
    this.getValoraciones();
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.indiceEdicion = null;
    this.nuevaValoracion = {
      owner: this.nuevoUsuario,
      experiencia: this.newExperience,
      vino: this.vinos,
      likes: 0,
      dislikes: 0,
      comments: [],
    };
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
  }

  // Método para cerrar el formulario
  cerrarFormulario() {
    this.formularioVisible = false;
  }

  getValoraciones(): void{
    this.valoracionService.getValoracion().subscribe(
      (data: valoracionesInterface[]) => {
        this.valoraciones = data
        .filter(exp => exp._id !== undefined)
        .sort((a, b) => b.likes - a.likes);
        console.log('Usuarios recibidos:', data.length);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  // Función para agregar o modificar un usuario
  agregarElemento(valoracionForm: NgForm): void {
    console.log('va');
    this.formSubmitted = true;
  
    if (this.indiceEdicion !== null) {
      // Estamos en modo edición, modificar el usuario existente
      this.valoraciones[this.indiceEdicion] = { ...this.nuevaValoracion, _id: this.valoraciones[this.indiceEdicion]._id };
  
      // Actualizar el usuario en la API
      this.valoracionService.updateValoracion(this.valoraciones[this.indiceEdicion]).subscribe(response => {
        console.log('Usuario actualizado:', response);
      });
  
      // Limpiar el estado de edición
      this.indiceEdicion = null;
    } else {
      // Modo agregar nuevo usuario
      const usuarioJSON: valoracionesInterface = {
        owner: this.nuevaValoracion.owner,
        experiencia: this.nuevaValoracion.experiencia,
        vino: this.nuevaValoracion.vino,
        likes: 0,
        dislikes: 0,
        comments: []
      };
  
      // Enviar el usuario a la API a través del UserService
      this.valoracionService.addValoracion(usuarioJSON).subscribe(response => {
        console.log('Valoracion agregada:', response);
        
        // Agregar el usuario con el _id generado por la API al array de usuarios en el frontend
        this.valoraciones.push({ ...usuarioJSON, _id: response._id }); // Añadir un nuevo estado de desplegado
      });
    }
  
    // Limpiar los campos del formulario y restablecer su estado
    this.indiceEdicion = null;
    this.resetForm(valoracionForm);
    this.cerrarFormulario();
  }
  

  // Función para limpiar el formulario
  resetForm(valoracionForm: NgForm): void { // Aceptar userForm como parámetro
    this.nuevoUsuario = {
      name: '',
      mail: '', // Añadir el campo email
      password: '',
      comment: '',
      habilitado: true
    };
    this.newExperience = {
      titulo: '',
      owner: '',
      participants: [],
      description: ''
    };
    this.nuevaValoracion = {
      owner: this.nuevoUsuario,
      experiencia: this.newExperience,
      vino: [],
      likes: 0,
      dislikes: 0,
      comments: [],
    };
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
    valoracionForm.resetForm(); // Reiniciar el formulario en la vista
  }

  // Función para eliminar un usuario usando el _id
  deleteValoracion(valoracionId: string): void {
    this.valoracionService.deleteValoracionById(valoracionId).subscribe(
      () => {
        console.log(`Valoracion con ID ${valoracionId} eliminada`);
        this.getValoraciones(); // Actualizar la lista de experiencias después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la experiencia:', error);
      }
    );
  }
  incrementarLike(index: number) {
    this.valoraciones[index].likes += 1;
    this.valoracionService.updateValoracion(this.valoraciones[index]).subscribe(
      () => {
        console.log(`Valoracion con ID actualizada`);
        this.getValoraciones(); // Actualizar la lista de experiencias después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la experiencia:', error);
      }
    );
  }

  incrementarDislike(index: number) {
    this.valoraciones[index].dislikes += 1;
    this.valoracionService.updateValoracion(this.valoraciones[index]).subscribe(
      () => {
        console.log(`Valoracion con ID actualizada`);
        this.getValoraciones(); // Actualizar la lista de experiencias después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la experiencia:', error);
      }
    );
  }
}