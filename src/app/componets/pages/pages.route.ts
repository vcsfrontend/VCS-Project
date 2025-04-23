

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
  {path:'pages',children:[
    {
      path: 'blog/blog',
      loadComponent: () =>
        import('./blog/blog/blog.component').then((m) => m.BlogComponent),
    },
    {
      path: 'blog/blogdetails',
      loadComponent: () =>
        import('./blog/blogdetails/blogdetails.component').then((m) => m.BlogdetailsComponent),
    },
    {
      path: 'blog/createblog',
      loadComponent: () =>
        import('./blog/createblog/createblog.component').then((m) => m.CreateblogComponent),
    },
    {
      path: 'chat',
      loadComponent: () =>
        import('./chat/chat.component').then((m) => m.ChatComponent),
    },
    {
      path: 'contacts',
      loadComponent: () =>
        import('./contacts/contacts.component').then((m) => m.ContactsComponent),
    },
    {
      path: 'contactus',
      loadComponent: () =>
        import('./contactus/contactus.component').then((m) => m.ContactusComponent),
    },
    {
      path: 'ecommerce/addproducts',
      loadComponent: () =>
        import('./ecommerce/addproducts/addproducts.component').then((m) => m.AddproductsComponent),
    },
    {
      path: 'ecommerce/cart',
      loadComponent: () =>
        import('./ecommerce/cart/cart.component').then((m) => m.CartComponent),
    },
    {
      path: 'ecommerce/checkout',
      loadComponent: () =>
        import('./ecommerce/checkout/checkout.component').then((m) => m.CheckoutComponent),
    },
    {
      path: 'ecommerce/editproducts',
      loadComponent: () =>
        import('./ecommerce/editproducts/editproducts.component').then((m) => m.EditproductsComponent),
    },
  {
      path: 'ecommerce/order-details',
      loadComponent: () =>
        import('./ecommerce/order-details/order-details.component').then((m) => m.OrderDetailsComponent),
    },
    {
      path: 'ecommerce/orders',
      loadComponent: () =>
        import('./ecommerce/orders/orders.component').then((m) => m.OrdersComponent),
    },
    // {
    //   path: 'ecommerce/products',
    //   loadComponent: () =>
    //     import('./ecommerce/products/products.component').then((m) => m.ProductsComponent),
    // },
    {
      path: 'ecommerce/productdetails',
      loadComponent: () =>
        import('./ecommerce/productdetails/productdetails.component').then((m) => m.ProductdetailsComponent),
    },
    {
      path: 'ecommerce/productslist',
      loadComponent: () =>
        import('./ecommerce/productslist/productslist.component').then((m) => m.ProductslistComponent),
    },
    {
      path: 'ecommerce/wishlist',
      loadComponent: () =>
        import('./ecommerce/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    },
    {
      path: 'email/mailapp',
      loadComponent: () =>
        import('./email/mailapp/mailapp.component').then((m) => m.MailappComponent),
    },
    {
      path: 'email/mailsettings',
      loadComponent: () =>
        import('./email/mailsettings/mailsettings.component').then((m) => m.MailsettingsComponent),
    },
  
  
    {
      path: 'empty',
      loadComponent: () =>
        import('./empty/empty.component').then((m) => m.EmptyComponent),
    },
    {
      path: 'faqs',
      loadComponent: () =>
        import('./faqs/faqs.component').then((m) => m.FaqsComponent),
    },
    {
      path: 'filemanager/filemanager',
      loadComponent: () =>
        import('./filemanager/filemanager/filemanager.component').then((m) => m.FilemanagerComponent),
    },
    {
      path: 'invoice/createinvoice',
      loadComponent: () =>
        import('./invoice/createinvoice/createinvoice.component').then((m) => m.CreateinvoiceComponent),
    },
    {
      path: 'invoice/invoicedetails',
      loadComponent: () =>
        import('./invoice/invoicedetails/invoicedetails.component').then((m) => m.InvoicedetailsComponent),
    },
    {
      path: 'invoice/invoicelist',
      loadComponent: () =>
        import('./invoice/invoicelist/invoicelist.component').then((m) => m.InvoicelistComponent),
    },
  
    // {
    //   path: 'landing',
    //   loadComponent: () =>
    //     import('./landing/landing.component').then((m) => m.LandingComponent),
    // },
    // {
    //   path: 'jobslanding',
    //   loadComponent: () =>
    //     import('./jobslanding/jobslanding.component').then((m) => m.JobslandingComponent),
    // },
    {
      path: 'notifications',
      loadComponent: () =>
        import('./notifications/notifications.component').then((m) => m.NotificationsComponent),
    },
    {
      path: 'pricing',
      loadComponent: () =>
        import('./pricing/pricing.component').then((m) => m.PricingComponent),
    },
    {
      path: 'profile',
      loadComponent: () =>
        import('./profile/profile.component').then((m) => m.ProfileComponent),
    },
    {
      path: 'reviews',
      loadComponent: () =>
        import('./reviews/reviews.component').then((m) => m.ReviewsComponent),
    },
    {
      path: 'team',
      loadComponent: () =>
        import('./team/team.component').then((m) => m.TeamComponent),
    },
    {
      path: 'terms-conditions',
      loadComponent: () =>
        import('./terms-conditions/terms-conditions.component').then((m) => m.TermsConditionsComponent),
    },
    {
      path: 'timeline',
      loadComponent: () =>
        import('./timeline/timeline.component').then((m) => m.TimelineComponent),
    },
    {
      path: 'to-do-list',
      loadComponent: () =>
      import('./to-do-list/to-do-list.component').then((m) => m.ToDoListComponent), 
    },

  ]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class pagesRoutingModule {
  static routes = admin;
}