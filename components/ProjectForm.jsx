"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import CustomMenu from "./CustomMenu";
import { categoryFilters } from "../constants";
import Button from "./Button";
import { createNewProject, fetchToken } from "../lib/actions";
import { updateProject } from "../lib/actions";

const ProjectForm = ({ type, session, project }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: project?.title || "",
    image: project?.image || "",
    description: project?.description || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { token } = await fetchToken();
    try {
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token);
        router.push("/");
      }
      if (type === "edit") {
        await updateProject(form, project?.id, token);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeImage = (e) => {
    e.preventDefault();
    const file = e.target?.files[0];
    if (!file) return;
    if (!file.type.includes("image")) return alert("Please Upload an image");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      handleStateChange("image", result);
    };
  };

  const handleStateChange = (fieldName, value) => {
    setForm((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "Choose a poster for your project"}
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required={type === "create"}
          className="form_image-input"
          onChange={handleChangeImage}
        />
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="project-poster"
            fill
          />
        )}
      </div>

      <FormField
        title="Title"
        state={form.title}
        placeholder="Flexible"
        setState={(value) => handleStateChange("title", value)}
      />

      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase your project"
        setState={(value) => handleStateChange("description", value)}
        isTextArea={true}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://rahulShah.com"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />

      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="https://github.com/rahulSailesh-shah"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />

      <div className="flexStart w-full">
        <Button
          title={
            isSubmitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          left={isSubmitting ? "" : "/plus.svg"}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
