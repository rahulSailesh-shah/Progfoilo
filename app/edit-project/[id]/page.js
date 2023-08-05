import Modal from "../../../components/Modal";
import ProjectForm from "../../../components/ProjectForm";
import { getCurrentUser } from "../../../lib/session";
import { getProjectDetails } from "../../../lib/actions";
import { redirect } from "next/navigation";
import React from "react";

const EditProject = async ({ params: { id } }) => {
  const session = await getCurrentUser();
  const result = await getProjectDetails(id);

  if (!session?.user) redirect("/");

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={result?.project} />
    </Modal>
  );
};

export default EditProject;
