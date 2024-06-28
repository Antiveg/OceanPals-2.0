import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useAuth } from '../../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface StoreItem {
  id: string;
  description: string;
  image: string;
  name: string;
  point: number;
  stock: number;
}

const Store: React.FC = () => {
  const { user } = useAuth();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'Stores'));
      const items: StoreItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as StoreItem;
        items.push({ ...data, id: doc.id });
      });
      setStoreItems(items);
    };

    const fetchUserPoints = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserPoints(userData.point || 0);
        }
      }
    };

    fetchStoreItems();
    fetchUserPoints();
  }, [user]);

  const handleRedeemClick = (item: StoreItem) => {
    setSelectedItem(item);
    setIsFirstModalOpen(true);
  };

  const handleFirstModalYes = () => {
    if (selectedItem && userPoints >= selectedItem.point) {
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const handleSecondModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItem && user) {
      const userRef = doc(db, 'Users', user.uid);
      const itemRef = doc(db, 'Stores', selectedItem.id);

      const itemDoc = await getDoc(itemRef);
      if (!itemDoc.exists()) {
        alert('Item does not exist.');
        return;
      }

      await updateDoc(userRef, {
        point: userPoints - selectedItem.point,
      });

      await updateDoc(itemRef, {
        stock: selectedItem.stock - 1,
      });

      setIsSecondModalOpen(false);
      alert('You have successfully redeemed the item.');
      navigate('/home');
    }
  };

  return (
    <section className="bg-gradient-to-tr from-teal-50 to-blue-200 py-10">
      <h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-7xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">OceanPals Store</span> Items
      </h1>
      <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
        <button type="button" className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">All categories</button>
        <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">Merchandise</button>
        <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">Electronics</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
        {storeItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
            <div className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md" style={{ backgroundImage: `url(${item.image})` }}></div>
            <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
              <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white">{item.name}</h3>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700">
                <span className="font-bold text-gray-800 dark:text-gray-200">{item.point} pt</span>
                <button onClick={() => handleRedeemClick(item)} className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-blue-700 rounded hover:bg-blue-800 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none">Redeem</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFirstModalOpen && selectedItem && (
        <>
          {/* Dark overlay */}
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"></div>
          {/* First modal */}
          <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="p-4 md:p-5">
                  {userPoints < selectedItem.point ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Not Enough Points</h3>
                      <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Your points are not enough to redeem this item. Let's go take an event!
                      </p>
                      <button
                        type="button"
                        className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => navigate('/events')}
                      >
                        Go to Events
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Redeem Item</h3>
                      <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Do you want to redeem {selectedItem.name} with {selectedItem.point} points?
                      </p>
                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          type="button"
                          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          onClick={() => setIsFirstModalOpen(false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={handleFirstModalYes}
                        >
                          Yes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isSecondModalOpen && selectedItem && (
        <>
          {/* Dark overlay */}
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"></div>
          {/* Second modal */}
          <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full text-left">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="p-4 md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Enter Shipping Details</h3>
                  <form className="mt-4 space-y-4" onSubmit={handleSecondModalSubmit}>
                    <div>
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        onClick={() => setIsSecondModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Store;
