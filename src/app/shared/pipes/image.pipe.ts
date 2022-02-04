import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  imgSrc = '/images/user.jpg';

  // args description:
  // args[0] 1 : for tournaments
  transform(image: string, args: any[]): string {
    console.log(image);

    if (image && (image.includes('http') || image.includes('https'))) {
      return image;
    } else if (image && image !== '') {
      return environment.file_url + '/' + image;
    }
    return environment.file_url + this.imgSrc;
  }
}
