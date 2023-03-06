import hmmExecFactory from 'hmm/src/executor';
import SystemConfigModel from "../db/models/system-config";
import UserModel from '../db/models/user';
import Announcement from "../db/models/announcement";
import TaskModel from "../db/models/tasks";

export default hmmExecFactory({
  systemConfig: SystemConfigModel,
  user: UserModel,
  announcement: Announcement,
  task: TaskModel,
  // add more models as you want
})
