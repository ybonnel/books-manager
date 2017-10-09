import { List } from 'immutable';
import { TasksState } from './reducer';
import { getVisibleTasks } from './selectors';
import { Task } from './task';


describe('tasks', () => {
  describe('selectors', () => {
    let tasks;

    beforeEach(() => {
      tasks = new TasksState({
        list: new List([
          new Task({completed: false, title: 'book-1'}),
          new Task({completed: true, title: 'book-2'})
        ])
      });
    });


    describe('getVisibleBooks()', () => {
      it('should return list of all tasks', () => {
        let taskList = getVisibleTasks({tasks});
        expect(taskList.size).toBe(2);
      });

      it('should return list of active (incomplete) tasks', () => {
        tasks = tasks.set('filter', 'active');
        let taskList = getVisibleTasks({tasks});

        expect(taskList.size).toBe(1);
        expect(taskList.get(0).title).toBe('book-1');
      });

      it('should return list of completed tasks', () => {
        tasks = tasks.set('filter', 'completed');
        let taskList = getVisibleTasks({tasks});

        expect(taskList.size).toBe(1);
        expect(taskList.get(0).title).toBe('book-2');
      });
    });
  });
});
