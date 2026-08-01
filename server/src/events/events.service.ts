import { Injectable } from '@nestjs/common';

export interface CampusEvent {
  id: string;
  title: string;
  location: string;
  city: string;
  date: string;
  description: string;
  images: string[];
  category: 'University Fest' | 'School PTM' | 'Book Fair' | 'Youth Conference';
}

@Injectable()
export class EventsService {
  private events: CampusEvent[] = [
    {
      id: 'ev-1',
      title: 'साहिtyam 2026 - CGC University',
      location: 'CGC University, Landran, Mohali',
      city: 'Mohali',
      date: '03-04 February 2026',
      description: 'Engaged thousands of college students with interactive book discussions on stress management, focus, and practical wisdom during the annual literary fest.',
      images: ['/assets/cgc1.jpg', '/assets/cgc2.jpg', '/assets/cgc3.jpg', '/assets/cgc4.jpg'],
      category: 'University Fest',
    },
    {
      id: 'ev-2',
      title: 'Cyanide 2025 - Panjab University',
      location: 'Panjab University, Sector 14, Chandigarh',
      city: 'Chandigarh',
      date: '21-23 February 2025',
      description: 'Over 3 enriching days at Panjab University, students from Philosophy, Science, and Humanities joined reflective dialogues around Vedanta and mindfulness.',
      images: ['/assets/pu1.jpg', '/assets/pu2.jpg', '/assets/pu3.jpg', '/assets/pu4.jpg'],
      category: 'University Fest',
    },
    {
      id: 'ev-3',
      title: 'PTM Bookstall - Doon Public School',
      location: 'Sector 21, Panchkula',
      city: 'Panchkula',
      date: '06 September 2025',
      description: 'Hosted a specialized Kids & Parent Wisdom bookstall providing moral storybooks, Bal Gita, and value education guides during the Parent Teacher Meeting.',
      images: ['/assets/d2.jpg', '/assets/d3.jpg', '/assets/d4.jpg', '/assets/d5.jpg'],
      category: 'School PTM',
    },
    {
      id: 'ev-4',
      title: 'Tricity Pustak Mela - Indradhanush Auditorium',
      location: 'Indradhanush Auditorium, Sector 5, Panchkula',
      city: 'Panchkula',
      date: '07-13 November 2025',
      description: 'A 7-day public book exhibition bringing classical Indian philosophy, character building literature, and youth guidance to the Tricity community.',
      images: ['/assets/event1.jpg', '/assets/event2.jpg', '/assets/event3.jpg', '/assets/event4.jpg'],
      category: 'Book Fair',
    }
  ];

  findAll(): CampusEvent[] {
    return this.events;
  }
}
