import { fetchAllProjects, fetchProjectsByCategory } from "../lib/actions";
import React from "react";
import ProjectCard from "../components/ProjectCard";
import Categories from "../components/Categories";
import LoadMore from "../components/LoadMore";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = "0";

const HomePage = async ({ searchParams: { category, endcursor } }) => {
  const data =
    category && category !== "All"
      ? await fetchProjectsByCategory(category, endcursor)
      : await fetchAllProjects(endcursor);
  let projectsToDisplay = data?.projectSearch?.edges || [];

  const pagination = data?.projectSearch?.pageInfo;

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <div className="min-h-screen">
          <p className="no-resut-text text-center mt-6">Its all empty here! </p>
        </div>
      </section>
    );
  }
  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <div className="min-h-screen">
        <section className="projects-grid">
          {projectsToDisplay.map(({ node }) => (
            <ProjectCard
              key={`${node?.id}`}
              id={node?.id}
              image={node?.image}
              title={node?.title}
              name={node?.createdBy?.name}
              avatarUrl={node?.createdBy?.avatarUrl}
              userId={node?.createdBy?.id}
            />
          ))}
        </section>
      </div>

      <LoadMore
        startCursor={pagination?.startCursor}
        endCursor={pagination?.endCursor}
        hasPreviousPage={pagination?.hasPreviousPage}
        hasNextPage={pagination?.hasNextPage}
      />
    </section>
  );
};

export default HomePage;
