import React from 'react';
import { Link } from 'react-router-dom';

const TrainingDetail: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:flex lg:-mx-6">
          <div className="lg:w-3/4 lg:px-6">
            <img className="object-cover object-center w-full h-80 xl:h-[28rem] rounded-xl" src="/assets/training/training-1.png" alt="Training" />

            <div>
              <p className="mt-6 text-sm text-blue-500 uppercase">Environment</p>

              <h1 className="max-w-lg mt-4 text-2xl font-semibold leading-tight text-gray-800 dark:text-white">
                Proper Ways to Clean Beaches
              </h1>

              <div className="flex items-center my-6">
                <img className="object-cover object-center w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=687&h=687&q=80" alt="Aurelia Puspita" />
                <div className="mx-4">
                  <h1 className="text-sm text-gray-700 dark:text-gray-200">Aurelia Puspita</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Lead</p>
                </div>
              </div>

              <p className="mb-3 text-gray-500 dark:text-gray-400">
                Sorting trash on the beach is a very important first step in maintaining environmental cleanliness and preserving the marine ecosystem. In this process, waste must be separated based on type, such as organic waste, plastic, paper and metal. Organic waste can be composted, while plastic, paper and metal can be recycled. To make the sorting process easier, provide several bags or bins with clear labels. Educating volunteers about the importance of sorting waste is also key to the success of this activity. Additionally, ensuring everyone understands the difference between recyclable and non-recyclable waste can reduce the volume of waste that ends up in landfills.
              </p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                Waste transport equipment is very helpful in collecting and moving waste from the beach to the processing or final disposal site. Tools such as grabbers or trash tongs can be used to pick up trash without having to bend over, making it more efficient and reducing the risk of injury. Apart from that, trolleys or trash trains can also be used to transport large amounts of waste. Using these tools not only speeds up the cleaning process, but also reduces direct contact with waste that may be hazardous or unhygienic. By using the right tools, the cleaning process can be carried out more quickly and efficiently, allowing volunteers to cover a wider area.
              </p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                After the rubbish is collected, the next step is to tie the rubbish bag properly to ensure that no rubbish gets spilled when it is moved. Make sure the trash bag is not too full so that it is easy to tie and doesn't tear easily. Use a strong rope or tie to secure the trash bag. If using a plastic trash bag, fold the top before tying it to ensure there are no leaks. Tying trash bags properly also helps minimize unpleasant odors and prevent wild animals from scavenging the trash. Providing a safe and neat waste collection place will also make the transportation process easier for cleaning staff.
              </p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                Efficient team coordination is key to successful beach cleanup activities. Each team member must have clear duties and responsibilities, such as waste sorting, transporting, and bag tying. Determining a team leader who is responsible for coordinating all activities is also very important. Good communication between team members must be maintained, for example by using communication tools such as walkie-talkies for large areas. In addition, conducting a briefing before the activity begins to explain the objectives, methods and safety procedures can increase the efficiency and effectiveness of team work. With good coordination, time and energy can be saved, and the results achieved will be maximized.
              </p>
            </div>
          </div>

          <div className="mt-8 lg:w-1/4 lg:mt-0 lg:px-6">
            <h2 className="mb-6 text-4xl font-bold dark:text-white">More Training</h2>

            <div>
              <h3 className="text-blue-500 capitalize">Environment</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Systems of Garbage Sorting
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Technology</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Getting Started with OceanPals
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Environment</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                10 Ways to Recreate Art from Waste
              </Link>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-blue-500 capitalize">Technology</h3>
              <Link to="#" className="block mt-2 font-medium text-gray-700 hover:underline hover:text-gray-500 dark:text-gray-400">
                Integrating AI for Photo Judgement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingDetail;
