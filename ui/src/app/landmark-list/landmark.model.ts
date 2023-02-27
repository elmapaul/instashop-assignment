export class Landmark {
  constructor(
    public order: number,
    public location: string[],
    public objectId: string,
    public description: string,
    public createdAt: string,
    public updatedAt: string,
    public photo: string,
    public photo_thumb: string,
    public short_info: string,
    public title: string,
    public url: string,
  ) {}
}
