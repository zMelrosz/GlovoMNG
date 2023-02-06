    const employees = [
        'Алексей Холодов',
        'Анатолий Макаров',
        'Данила Шелестов',
        'Оскар Горин',
        'Станислав Бородин',
        'Виктор Громов',
        'Александра Шаламова',
        'Анна Ступина',
        'Илья Усачев',
        'Андрей Морозов',
        'Игорь Хоменко',
      ];
    
      const userTemplate = document.querySelector('#user').content;
      const usersOptions = document.querySelector('.form__select');
    
      for (let i = 0; i < employees.length; i++) {
        const userElement = userTemplate.querySelector('.form__user').cloneNode(true);
        userElement.textContent = employees[i];
        usersOptions.append(userElement);
    }