import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

import { authGuard } from './service/auth.guard';
import { ChatComponent } from './pages/chat/chat.component';
import { FeedComponent } from './pages/feed/feed.component';
import { FrindsComponent } from './frinds/frinds.component';

export const routes: Routes = [
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: SignupComponent
    },

    {
        path: 'feed', component: FeedComponent, canActivate: [authGuard]
    },
    {
        path: 'chat', component: ChatComponent
    },
    {
        path: 'frinds', component: FrindsComponent
    }
];