import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './features/about-page/components/about-page/about-page.component';
import { LoginPageComponent } from './features/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/components/register-page/register-page.component';
import { ProfilePageComponent } from './features/profile/components/profile-page/profile-page.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { guestGuard } from './features/auth/guards/guest.guard';
import { ProfileEditPageComponent } from './features/profile/components/profile-edit-page/profile-edit-page.component';

export const routes: Routes = [
  {
    title: 'О нас',
    path: 'about',
    component: AboutPageComponent,
  },
  {
    title: 'Вход',
    path: 'auth/login',
    canActivate: [guestGuard],
    component: LoginPageComponent,
  },
  {
    title: 'Регистрация',
    path: 'auth/register',
    canActivate: [guestGuard],
    component: RegisterPageComponent,
  },
  {
    title: 'Личный кабинет',
    path: 'profile',
    canActivate: [authGuard],
    component: ProfilePageComponent,
  },
  {
    title: 'Личный кабинет',
    path: 'profile/edit',
    canActivate: [authGuard],
    component: ProfileEditPageComponent,
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }, // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
