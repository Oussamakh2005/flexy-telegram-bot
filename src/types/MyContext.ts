import type { Context, Scenes } from "telegraf";

interface MySession extends Scenes.SceneSession {}
export interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}