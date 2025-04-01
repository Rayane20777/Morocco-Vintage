import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError, map } from "rxjs/operators"
import { environment } from "../../environments/environment"
import { User } from "../store/users/user.types"
import { ApiService } from './api.service'

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  roles: string[];
  imageId?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error("Error fetching users:", error)
        return throwError(() => new Error(error.message || "Failed to fetch users"))
      }),
    )
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching user ${id}:`, error)
        return throwError(() => new Error(error.message || "Failed to fetch user"))
      }),
    )
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    console.log('Updating user:', { id, user });
    
    const formData = new FormData();
    Object.keys(user).forEach(key => {
      const value = user[key as keyof User];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return this.http.put<User>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError((error) => {
        console.error(`Error updating user ${id}:`, error);
        return throwError(() => new Error(error.message || "Failed to update user"));
      }),
    );
  }

  updateUserRoles(userId: string, roles: string[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/roles`, roles).pipe(
      catchError((error) => {
        console.error(`Error updating roles for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to update user roles"))
      }),
    )
  }

  updateUserStatus(userId: string, active: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/status`, { active }).pipe(
      catchError((error) => {
        console.error(`Error updating status for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to update user status"))
      }),
    )
  }

  uploadProfileImage(userId: string, image: File): Observable<User> {
    const formData = new FormData()
    formData.append("image", image)
    return this.http.put<User>(`${this.apiUrl}/${userId}/profile-image`, formData).pipe(
      catchError((error) => {
        console.error(`Error uploading profile image for user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to upload profile image"))
      }),
    )
  }

  getProfileImageUrl(imageId: string): string {
    if (!imageId) return '';
    return `${environment.apiUrl}/images/${imageId}`;
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error(`Error deleting user ${userId}:`, error)
        return throwError(() => new Error(error.message || "Failed to delete user"))
      }),
    )
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.apiService.get<UserProfile>('/admin/users/profile').pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(() => new Error('Failed to fetch user profile'));
      })
    );
  }

  updateProfile(formData: FormData): Observable<UserProfile> {
    return this.apiService.put<UserProfile>('/admin/users/profile', formData).pipe(
      catchError(error => {
        console.error('Error updating user profile:', error);
        return throwError(() => new Error('Failed to update user profile'));
      })
    );
  }

  getProfileImage(userId: string): Observable<Blob> {
    return this.apiService.get<Blob>(`/admin/users/${userId}/profile-image`).pipe(
      catchError(error => {
        console.error('Error fetching profile image:', error);
        return throwError(() => new Error('Failed to fetch profile image'));
      })
    );
  }
}

