import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(movies: any[], searchTerm: string): any[] {
    if (!movies || !searchTerm) {
      return movies; 
    }

    return movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
