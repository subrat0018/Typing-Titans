import React from "react";
import { useState } from "react";

//Modal to add delivery person
const UserNameInput = ({ setUserName }) => {
  const [name, setName] = useState("");
  return (
    <div class="overflow-y-auto overflow-x-hidden fixed top-0 left-50 right-24 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
      <div class="relative p-4 w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 max-w-lg h-full md:h-auto">
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Set A Username
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                setUserName("xyz");
              }}
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <form action="#">
            <div class="grid gap-4 mb-4 sm:grid-cols-1">
              <div className="flex flex-row justify-between">
                <label
                  for="name"
                  class=" items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  name="name"
                  id="name"
                  class=" items-center -translate-y-2 w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Subrat"
                  required=""
                />
              </div>
            </div>
            <div className="flex flex-row justify-end space-x-3">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  setUserName(name);
                }}
                type="submit"
                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Set
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  setUserName("xyz");
                }}
                type="submit"
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Random
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserNameInput;
