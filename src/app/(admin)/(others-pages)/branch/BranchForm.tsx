"use client";

import React from "react";
import { useModal } from "../../../../hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

export interface Branch {
  branchId: string;
  region: string;
  district: string;
  city: string;
  branchName: string;
  grade: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export default function BranchForm() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Branch saved...");
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Branch Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Branch ID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                BR001
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Branch Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Central Branch
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Region
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Addis Ababa
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                District
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Bole
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                City
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Addis Ababa
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Grade
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                A
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                +251 912 345 678
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="w-[500px] mx-auto my-20" // medium width and centered
      >
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Branch Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update the branch details to keep records accurate.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Branch ID</Label>
                  <Input type="text" defaultValue="BR001" />
                </div>

                <div>
                  <Label>Branch Name</Label>
                  <Input type="text" defaultValue="Central Branch" />
                </div>

                <div>
                  <Label>Region</Label>
                  <Input type="text" defaultValue="Addis Ababa" />
                </div>

                <div>
                  <Label>District</Label>
                  <Input type="text" defaultValue="Bole" />
                </div>

                <div>
                  <Label>City</Label>
                  <Input type="text" defaultValue="Addis Ababa" />
                </div>

                <div>
                  <Label>Grade</Label>
                  <Input type="text" defaultValue="A" />
                </div>

                <div className="col-span-2">
                  <Label>Phone</Label>
                  <Input type="text" defaultValue="+251 912 345 678" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
