import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { DiPreTreatMenuComponent } from './components/dipretreat-menu/di-pre-treat-menu.component';
import { DiPreTreatPremiseComponent } from './components/di-pre-treat-premise/di-pre-treat-premise.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'DiPreTreatHome',
    // canActivate: [AuthGuard],
    component: DiPreTreatMenuComponent
  },
  {
    path: 'premiseDetails',
    component: DiPreTreatPremiseComponent
  },
  {
    path: 'logged',
    children: [
      // {
      //   path: 'applicationi-internet/students',
      //   component: StudentsContComponent
      // },
      // {
      //   path: 'applicationi-internet/vms',
      //   component: VmsContComponentComponent
      // }
    ]
  },

  {
    path: '**',
    component: PageNotFoundComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
