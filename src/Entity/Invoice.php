<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *      collectionOperations={
 *          "get",
 *          "post"
 *      },
 *      itemOperations={"get", "put", "delete"},
 *      attributes={
 *          "pagination_enabled"=false,
 *          "pagination_items_per_page"=10,
 *          "order"={"amount":"desc"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoice:read"}
 *      },
 *      denormalizationContext={"disable_type_enforcement"=true, "datetime_format"="Y-m-d"},
 *      subresourceOperations={
 *          "api_customers_invoices_get_subresource"={
 *              "normalization_context"={"groups"={"invoice:subresource:read"}}
 *          }
 *      }
 * )
 * @ApiFilter(SearchFilter::class, properties={"status":"partial"})
 * @ApiFilter(OrderFilter::class, properties={"amount","sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoice:read", "invoice:subresource:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoice:read", "invoice:subresource:read"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un nombre")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoice:read", "invoice:subresource:read"})
     * @Assert\Type(type="\DateTimeInterface",message="La date doit être au format YYYY-MM-DD")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoice:read", "invoice:subresource:read"})
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Les valeurs possibles pour le status sont SENT, PAID et CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoice:read"})
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoice:read", "invoice:subresource:read"})
     * @Assert\NotBlank(message="Le chrono ne peut pas être null")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;


    /**
     * Get user related to the invoice
     *
     * @return User|null
     * 
     * @Groups({"invoice:read"})
     */
    public function getUser(): ?User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt = null): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
