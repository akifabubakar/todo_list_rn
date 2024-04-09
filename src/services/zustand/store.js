import { create } from 'zustand';
import axios from 'axios';
import dayjs from 'dayjs';
import Config from 'react-native-config';
const baseURL = Config.API_URL ?? 'http://localhost:3000/';

const api = axios.create({ baseURL });

export const useTasksStore = create((set, get) => ({
  tasks: {},
  querydate: dayjs().endOf('day').toISOString(),
  addTask: async add => {
    // add new task
    let resp = await api({
      method: 'post',
      url: '/tasks',
      data: add,
    });

    // append new task to list of tasks
    set(state => {
      if (
        dayjs(add.date).endOf('day').toISOString() ===
        dayjs(state.querydate).endOf('day').toISOString()
      ) {
        const tasks = [resp.data, ...state.tasks]; // copy the array
        return { tasks };
      }
      return { tasks: state.tasks };
    });
  },
  getTasks: async date => {
    // get tasks from api
    let resp = await api({
      method: 'get',
      url: '/tasks',
      params: {
        date,
      },
    });

    // append all tasks
    set({ tasks: resp.data });
  },
  updateTaskStatus: async task => {
    // update task status (completed / not)

    await api({
      method: 'put',
      url: `/tasks/${task._id}`,
      data: task,
    });

    set(state => {
      const tasks = [...state.tasks]; // copy the array
      const update = tasks.map(item => {
        if (item._id === task._id) {
          return {
            ...item,
            completed: task.completed,
          };
        }

        return item;
      });
      return { tasks: update };
    });
  },
  updateTask: async task => {
    // update task detail
    await api({
      method: 'put',
      url: `/tasks/${task._id}`,
      data: task,
    });

    set(state => {
      let tasks = state.tasks;

      if (
        dayjs(task.date).endOf('day').toISOString() !==
        dayjs(state.querydate).endOf('day').toISOString()
      ) {
        tasks = state.tasks.filter(exist => exist._id !== task._id);
      } else {
        tasks = state.tasks.map(exist => {
          if (exist._id === task._id) {
            return { ...exist, ...task };
          }

          return exist;
        });
      }

      return { tasks };
    });
  },
  deleteTask: async task => {
    // delete task
    await api({
      method: 'delete',
      url: `/tasks/${task._id}`,
    });

    set(state => {
      const tasks = state.tasks.filter(exist => exist._id !== task._id);
      return { tasks };
    });
  },
  getTaskDates: async () => {
    // get task dates
    let resp = await api({
      method: 'get',
      url: '/tasks/date',
    });

    return resp;
  },
  setDate: date => {
    set({ querydate: date });
    get().getTasks(date);
  },
}));
