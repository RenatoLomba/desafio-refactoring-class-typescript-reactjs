import { FC, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import FoodItem from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

type FoodInput = Omit<Food, 'id' | 'available'>;

const Dashboard: FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState({} as Food);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAddFood = async (food: FoodInput) => {
    try {
      const response = await api.post<Food>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleUpdateFood = async (food: Food) => {
    try {
      const foodUpdated = await api.put<Food>(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const handleEditFood = (food: Food) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  useEffect(() => {
    api.get<Food[]>('/foods').then((response) => {
      setFoods(response.data);
    });
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodItem
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
