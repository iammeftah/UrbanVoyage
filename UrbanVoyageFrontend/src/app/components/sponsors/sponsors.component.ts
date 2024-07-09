import { Component, OnInit } from '@angular/core';

interface Sponsor {
  name: string;
  imageUrl: string;
  website: string;
}

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {
  sponsors: Sponsor[] = [
    { name: 'CTM Maroc', imageUrl: 'https://ctm.ma/wp-content/uploads/2020/11/logo_ctm-1.png', website: 'https://ctm.ma/' },
    { name: 'Ghazala', imageUrl: 'https://www.transghazala.ma/img/ghazala-logo-blanc.svg', website: 'https://www.transghazala.ma/' },
    { name: 'SupraTour', imageUrl: 'https://www.comparabus.com/bundles/static/uploads/Bus/Supratours/supratours-compagnie-maroc-autocars-voyage.png', website: 'https://www.supratours.ma/' },
    { name: 'Globus', imageUrl: 'http://www.globusvoyages.com/files/images/logo.png', website: 'http://www.globusvoyages.com/' },
  ];

  duplicatedSponsors: Sponsor[] = [];

  ngOnInit() {
    // Duplicate the sponsors array to create a seamless loop
    this.duplicatedSponsors = [...this.sponsors, ...this.sponsors];
  }
}
