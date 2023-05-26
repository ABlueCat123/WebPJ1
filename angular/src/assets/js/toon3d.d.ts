declare class Preloader{
  constructor(options:any);
  checkCompleted():boolean;
  get progress():any;
  load(url:string):void;
}
