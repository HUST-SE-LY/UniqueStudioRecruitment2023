<script lang="ts">
  import { push } from "svelte-spa-router";
  import { Group, InterviewPlace, Period, type TIMELINE } from "../../../config/const";
  import Button from "../../public/Button.svelte";
  import type { UserStep } from "../../../types";
  import TimeSelector from "./TimeSelector.svelte";
  import InterviewInfo from "./InterviewInfo.svelte";
  import greet from "../../../assets/greet.svg";
  import NightTestInfo from "./NightTestInfo.svelte";
  import { userInfo } from "../../../stores/userInfo";
  import { recruitment } from "../../../stores/recruitment";
  import type { Application } from "../../../types/application";
  import { getInterviewTimes } from "../../../requests/application/getInterviewTimes";
  import { formatDate, formatTime } from "../../../utils/formmatDate";
  import { parseTitle } from "../../../utils/parseTitle";
  export let step: UserStep;
  export let applicationInfo: Application;
  let selectedTimes = applicationInfo.interview_selections.map((el) => el.uid);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="w-full rounded-lg p-[20px_28px] mt-[3rem] bg-blue-100">
  {#if step !== "通过"}
    <p class="font-bold text-lg mb-[1rem]">当前流程：{step}</p>
  {/if}
  {#if step === "报名"}
    <p>
      {$userInfo.applications[0].recruitment_id === $recruitment.uid
        ? `你已经成功报名${parseTitle($recruitment.name)}${
            Group[$userInfo.applications[0].group]
          }组，报名结束前你可以随时修改个人信息。点击修改`
        : "请填写基础信息、意向组别、简历等用于报名，帮助我们更好地了解你。点击填写"}
      <span
        on:click={() => push("/user")}
        class="text-blue-300 underline cursor-pointer">个人信息</span
      >
    </p>
  {:else if step === "笔试/问卷"}
    <p>各组会根据本组情况，设计笔试/问卷，这是联创团队招新的必经环节。</p>
    <p class="mt-[0.5rem]">
      查看最新的<a
        class=" text-blue-300 underline"
        href="www.bilibili.com"
        download>笔试/问卷链接</a
      >
    </p>
  {:else if step === "组面时间选择"}
    {#await getInterviewTimes(applicationInfo.recruitment_id, applicationInfo.group)}
      <p>获取可供选择的时间中</p>
    {:then res}
      <TimeSelector
        type="group"
        aid={applicationInfo.uid}
        times={res.data}
        bind:selectedTimes
      />
    {/await}
  {:else if step === "组面"}
    <InterviewInfo
      group={applicationInfo.group}
      time={applicationInfo.interview_allocations_group.uid
        ? `${formatDate(
            applicationInfo.interview_allocations_group.date
          )}${Period[applicationInfo.interview_allocations_group.period]}${formatTime(
            applicationInfo.interview_allocations_group.start
          )}`
        : ""}
      type="group"
    />
  {:else if step === "熬测"}
    <NightTestInfo group={applicationInfo.group} time={formatDate($recruitment.stress_test_start) + formatTime($recruitment.stress_test_start)} />
  {:else if step === "群面时间选择"}
    {#await getInterviewTimes(applicationInfo.recruitment_id)}
      <p>获取可选择的时间中...</p>
    {:then res}
      <TimeSelector
        type="team"
        aid={applicationInfo.uid}
        times={res.data}
        bind:selectedTimes
      />
    {/await}
  {:else if step === "群面"}
    <InterviewInfo time={applicationInfo.interview_allocations_team.uid
      ? `${formatDate(
          applicationInfo.interview_allocations_team.date
        )}${Period[applicationInfo.interview_allocations_team.period]}${formatTime(
          applicationInfo.interview_allocations_team.start
        )}`
      : ""} type="team" group={applicationInfo.group} />
  {:else if step === "通过"}
    <div class="flex items-center gap-[4px]">
      <p class="text-lg">恭喜你加入了联创团队</p>
      <img class="inline" src={greet} alt="欢迎" />
    </div>
    <p class="text-gray-300 mt-[8px]">其他信息请与组长沟通</p>
  {/if}
</div>
