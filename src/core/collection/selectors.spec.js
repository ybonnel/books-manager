import { List } from 'immutable';
import { AuthorsState } from './reducer';
import { getVisibleBooks } from './selectors';
import { Book } from './collection';


describe('tasks', () => {
  describe('selectors', () => {
    let tasks;

    beforeEach(() => {
      tasks = new AuthorsState({
        list: new List([
          new Book({completed: false, title: 'book-1'}),
          new Book({completed: true, title: 'book-2'})
        ])
      });
    });


    describe('getVisibleBooks()', () => {
      it('should return list of all tasks', () => {
        let taskList = getVisibleBooks({tasks});
        expect(taskList.size).toBe(2);
      });

      it('should return list of active (incomplete) tasks', () => {
        tasks = tasks.set('filter', 'active');
        let taskList = getVisibleBooks({tasks});

        expect(taskList.size).toBe(1);
        expect(taskList.get(0).title).toBe('book-1');
      });

      it('should return list of completed tasks', () => {
        tasks = tasks.set('filter', 'completed');
        let taskList = getVisibleBooks({tasks});

        expect(taskList.size).toBe(1);
        expect(taskList.get(0).title).toBe('book-2');
      });
    });
  });
});
