import { Component, OnInit } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { pageInterface } from '../../models/paginacion.model';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  standalone: true,
  styleUrls: ['./experiencia.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe]
})
export class ExperienciaComponent implements OnInit {
  experiencias: Experiencia[] = []; // Lista de experiencias
  users: User[] = []; // Lista de usuarios para los desplegables
  selectedParticipants: string[] = []; // Participantes seleccionados como ObjectId
  errorMessage: string = ''; // Variable para mostrar mensajes de error
  ownerFilter: string = '';

  nuevapaginacion: pageInterface = {
    paginas: 1,
    numerodecaracterespp: 5
  };

  // Estructura inicial para una nueva experiencia
  newExperience: Experiencia = {
    titulo: '',
    owner: '',
    participants: [],
    description: ''
  };

  newExperience2: Experiencia = {
    titulo:'',
    owner: '',
    participants: [],
    description: ''
  };

  constructor(private experienciaService: ExperienciaService, private userService: UserService) {}

  filterExperiencias='';

  ngOnInit(): void {
    this.getExperiencias(); // Obtener la lista de experiencias
    this.getUsers(); // Obtener la lista de usuarios

  }

  // Obtener la lista de experiencias desde la API
  getExperiencias(): void {
    this.experienciaService.getExperiencias().subscribe(
      (data: Experiencia[]) => {
        // Filtrar experiencias que tengan _id definido
        this.experiencias = data.filter(exp => exp._id !== undefined);
        console.log('Experiencias recibidas:', data);
      },
      (error) => {
        console.error('Error al obtener las experiencias:', error);
      }
    );
  }

  getExperienciasFiltradas(ownerF:string): void {
    if (ownerF==''){
      this.experienciaService.getExperiencias().subscribe(
        (data: Experiencia[]) => {
          // Filtrar experiencias que tengan _id definido
          this.experiencias = data.filter(exp => exp._id !== undefined);
          console.log('Experiencias recibidas:', data);
        },
        (error) => {
          console.error('Error al obtener las experiencias:', error);
        }
      );
    } else {
      this.experienciaService.getExperiencias().subscribe(
        (data: Experiencia[]) => {
          // Filtrar experiencias que tengan _id definido
          this.experiencias = data.filter(exp => exp._id !== undefined && exp.owner == ownerF);
          console.log('Experiencias recibidas:', data);
        },
        (error) => {
          console.error('Error al obtener las experiencias:', error);
        }
      );
    }
    
  }

  // Obtener la lista de usuarios desde la API
  getUsers(): void {
    this.userService.getUsers(this.nuevapaginacion).subscribe(
      (data: User[]) => {
        this.users = data;
        console.log('Usuarios recibidos:', data);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }
  
  onFilter(): void {
    this.ownerFilter = this.newExperience2.owner;
    console.log('filtrao',this.newExperience2.owner);
    this.getExperienciasFiltradas(this.ownerFilter);
    this.newExperience = {
      titulo: '',
      owner: '',
      participants: [],
      description: ''
    };
  }

  elFilter():void{
    this.ownerFilter = '';
    this.getExperienciasFiltradas(this.ownerFilter);
  }

  // Obtener el nombre de un usuario dado su ObjectId
  getUserNameById(userId: string): string|null {
    const user = this.users.find((u) => u._id === userId);
    return user ? user.name : 'Desconocido';
  }

  // Manejar el envío del formulario con validación de campos
  onSubmit(): void {
    this.errorMessage = ''; // Limpiar mensajes de error

    // Verificar si los campos están vacíos
    if (!this.newExperience.owner || this.selectedParticipants.length === 0 || !this.newExperience.description) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Convertir selectedParticipants a ObjectId[] antes de enviar al backend
    this.newExperience.participants = this.selectedParticipants;

    // Llamar al servicio para agregar la nueva experiencia
    this.experienciaService.addExperiencia(this.newExperience).subscribe(
      (response) => {
        console.log('Experiencia creada:', response);
        this.getExperiencias(); // Actualizar la lista de experiencias después de crear una nueva
        this.resetForm(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear la experiencia:', error);
      }
    );
  }

  // Método para eliminar una experiencia por su ID
  deleteExperience(experienceId: string): void {
    this.experienciaService.deleteExperiencia(experienceId).subscribe(
      () => {
        console.log(`Experiencia con ID ${experienceId} eliminada`);
        this.getExperiencias(); // Actualizar la lista de experiencias después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la experiencia:', error);
      }
    );
  }

  // Resetear el formulario después de crear una experiencia
  resetForm(): void {
    this.newExperience = {
      titulo: '',
      owner: '',
      participants: [],
      description: ''
    };
    this.selectedParticipants = []; // Limpiar los participantes seleccionados
    this.errorMessage = ''; // Limpiar el mensaje de error
  }
}
